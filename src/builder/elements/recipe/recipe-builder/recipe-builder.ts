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

    bus.suscribe(MessageType.NewStepCreated, this._onNewStepCreated, this);

    Promise.all([
      bus.onFirstMsg(MessageType.EquipmentsLoaded),
      bus.onFirstMsg(MessageType.StylesLoaded)
    ]).then(() => {
      this.set('recipe', RecipeBuilder.defaultRecipe());
    });
    window.builder = this;
  }

  public static defaultRecipe() : Recipe {
    Log.info("RecipeBuilder", "Ready to Build");
    var
        recipe = new Recipe(Equipments.byRef("brewru:kettle_6.5")),

      kettle = recipe.getReactors()[0],
      firstFerm:EquipmentStep,

        bucket:Equipment = Equipments.byRef("brewru:bucket_5gal"),
        carboy:Equipment = Equipments.byRef("brewru:glassCarboy_5.5"),
        bottles:Equipment = Equipments.byRef("brewru:newGrolshBottles"),

      // Ingredient
      tapWater:Supply.Ing = new Supply.Ing(Entities.tapWater, IngType.Water, [PhysQty.byRef("brewru:volume")]),
      lme:Supply.Ing = new Supply.Ing(Entities.lmeClear, IngType.Fermentable, [PhysQty.byRef("brewru:volume")]),
      dme:Supply.Ing = new Supply.Ing(Entities.dmeClear, IngType.Fermentable, [PhysQty.byRef("brewru:mass")]),
      columbus:Supply.Ing = new Supply.Ing(Entities.columbusHop, IngType.Hops, [PhysQty.byRef("brewru:mass")]),
      yeast: Supply.Ing = new Supply.Ing(Entities.us05, IngType.Yeast, [PhysQty.byRef("brewru:counts")]),
      primingSugar: Supply.Ing = new Supply.Ing(Entities.tableSugar, IngType.Fermentable, [PhysQty.byRef("brewru:mass")]),

      // Common Quantity
      water23l: Quantity = new Quantity(23, SU('L')),
      oneKg: Quantity = new Quantity(1, SU('kg')),
      fiftyGram: Quantity = new Quantity(50, SU('g')),
      threeCup: Quantity = new Quantity(3, SU('cup'));

    // Recipe Description
    recipe.description = 'APA recipe from xBeeriment';
    recipe.style = Styles.byRef("brewru:bjcp_2015_21A");
    recipe.name = 'xAPA';

    // Recipe
    kettle
      .addIng('Add Water', tapWater, water23l)
      .heat('Bring to a boil', TempTarget.getBoil())
      .addIng('Add LME', lme, oneKg)
      .addIng('Add DME', dme, oneKg)
      .heat('Maintain for 60 min', new TimeTarget(60, SU('min')));

    // Main Boil
    kettle.getHeat()[1]
      .onBegin()
        .addIng('Bittering Hop', columbus, fiftyGram)
      .toEnd(new TimeTarget(25, SU('min')))
        .addIng('Dual Purpose Hop', columbus, fiftyGram)
      .onEnd()
        .addIng('Aroma Hop', columbus, fiftyGram);

    // Cooling
    kettle.cool('Cool to 22C', new TempTarget(22, SU("°C")));

    // First Fermentation
    firstFerm = kettle.transferTo(bucket, [MiscStepType.Decantation, MiscStepType.Moderate_Aeration]);
    firstFerm
        .addIng('Add Yeast', yeast, new Quantity(1, SU('u')))
        .ferment('First Fermentation', new TimeTarget(4, SU('day')));

    // Dry Hopping
    firstFerm.getFerm()[0]
      .toEnd(new TimeTarget(2, SU('day')))
        .addIng('Dry Hoping', columbus, fiftyGram);

    firstFerm.transferTo(carboy, [MiscStepType.Decantation])
      .ferment('Second Fermentation', new TimeTarget(21, SU('day')))
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