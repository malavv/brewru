/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

import IngType = Supply.Type;
interface Window { builder: any;
}

class RecipeBuilder extends Polymer.DomModule {
  inventory: Inventory;
  ingredients: Ingredients;
  recipe: Recipe;
  server: Server;

  ready() {
    this.server = new ServerImpl("ws://localhost:8025/socket");
    this.ingredients = new Ingredients();

    this.set('recipe', this.defaultRecipe());

    bus.suscribe(MessageType.NewStepCreated, this._onNewStepCreated, this);
    window.builder = this;
  }

  public defaultRecipe() : Recipe {
    var
      equip = new UserEquip(),
      recipe = new Recipe(equip.getById("user:65galKettle")),

      kettle = recipe.getEquipments()[0],
      firstFerm:EquipmentStep,

      bucket: Equipment = equip.getById('user:6galBottlingBucket'),
      carboy: Equipment = equip.getById('user:5galCarboy'),
      bottles: Equipment = equip.getById('user:grolshBottles'),

      // Ingredient
      tapWater:Supply.Ing = new Supply.Ing(Entities.tapWater, IngType.Water, Dim.Volume),
      lme:Supply.Ing = new Supply.Ing(Entities.lmeClear, IngType.Fermentable, Dim.Volume),
      dme:Supply.Ing = new Supply.Ing(Entities.dmeClear, IngType.Fermentable, Dim.Mass),
      columbus:Supply.Ing = new Supply.Ing(Entities.columbusHop, IngType.Hops, Dim.Mass),
      yeast: Supply.Ing = new Supply.Ing(Entities.us05, IngType.Yeast, Dim.Unit),
      primingSugar: Supply.Ing = new Supply.Ing(Entities.tableSugar, IngType.Fermentable, Dim.Mass),

      // Common Quantity
      water23l: Quantity = new Quantity(23, SI.sym('l')),
      oneKg: Quantity = new Quantity(1, SI.sym('kg')),
      fiftyGram: Quantity = new Quantity(50, SI.sym('g')),
      threeCup: Quantity = new Quantity(3, SI.sym('cup'));

    // Recipe Description
    recipe.description = 'APA recipe from xBeeriment';
    recipe.style = Styles.americanIpa;
    recipe.name = 'xAPA';

    // Recipe
    kettle
      .addIng('Add Water', tapWater, water23l)
      .heat('Bring to a boil', TempTarget.BOIL)
      .addIng('Add LME', lme, oneKg)
      .addIng('Add DME', dme, oneKg)
      .heat('Maintain for 60 min', new TimeTarget(60, SI.sym('min')));

    // Main Boil
    kettle.getHeat()[1]
      .onBegin()
        .addIng('Bittering Hop', columbus, fiftyGram)
      .toEnd(new TimeTarget(25, SI.sym('min')))
        .addIng('Dual Purpose Hop', columbus, fiftyGram)
      .onEnd()
        .addIng('Aroma Hop', columbus, fiftyGram);

    // Cooling
    kettle.cool('Cool to 22C', new TempTarget(22, SI.sym("C")));

    // First Fermentation
    firstFerm = kettle.transferTo(bucket, [MiscStepType.Decantation, MiscStepType.Moderate_Aeration]);
    firstFerm
        .addIng('Add Yeast', yeast, new Quantity(1, SI.sym('u')))
        .ferment('First Fermentation', new TimeTarget(4, SI.sym('day')));

    // Dry Hopping
    firstFerm.getFerm()[0]
      .toEnd(new TimeTarget(2, SI.sym('day')))
        .addIng('Dry Hoping', columbus, fiftyGram);

    firstFerm.transferTo(carboy, [MiscStepType.Decantation])
      .ferment('Second Fermentation', new TimeTarget(21, SI.sym('day')))
      .transferTo(bucket, [MiscStepType.Decantation])
      .addIng('Priming Sugar', primingSugar, threeCup)
      .transferTo(bottles, [MiscStepType.Decantation]);

    return recipe;
  }

  public saveRecipe() {
    //localStorage.setItem('recipe', JSON.stringify(this.recipe));
  }

  public loadRecipe() {
    //var json = JSON.parse(localStorage.getItem('recipe'));
    //this.recipe = Recipe.decode(json);
  }

  private _onNewStepCreated(config: {name:string; type:ConceptRef}) {
    this.push('recipe.reactors.0.steps', new Step(config.name, config.type));
    bus.publish(MessageType.RecipeChanged);
  }
}

window.Polymer(window.Polymer.Base.extend(RecipeBuilder.prototype, {
  is: 'recipe-builder',
  properties: {
    inventory: {
      type: Object,
      notify: true
    },
	  ingredients: {
      type: Object,
      notify: true
    },
	  recipe: {
      type: Object,
      notify: true
    }
  }
}));