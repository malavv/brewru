/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

import IngType = Supply.IngType;
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

  public defaultRecipe() : RecipeImpl {
    var recipe = new RecipeImpl(),
        equip = new UserEquip();
    recipe.description = 'APA recipe from xBeeriment';
    recipe.style = Styles.americanIpa;

    recipe.addStep(new EquipmentStep(equip.getById("user:65galKettle")));
    recipe.addStep(new IngredientStep(
        'Add Water',
        new Supply.Ing(Entities.tapWater, null, [Dim.Volume]),
        new Quantity(23, SI.sym('l'))));

    var bringToBoil:HeatingStep[] = HeatingStep.create("Bring to a boil");
    recipe.addStep(bringToBoil[0]);
    recipe.addStep(bringToBoil[1]);

    recipe.addStep(new IngredientStep(
        'Add LME',
        new Supply.Ing(Entities.lmeClear, IngType.Fermentable, [Dim.Mass]),
        new Quantity(1, SI.sym('kg'))));
    recipe.addStep(new IngredientStep(
        'Add DME',
        new Supply.Ing(Entities.lmeClear, IngType.Fermentable, [Dim.Mass]),
        new Quantity(1, SI.sym('kg'))));

    var keepHeating:HeatingStep[] = HeatingStep.create("60 min @100c");
    var tminus30 = new HeatingStep("Middle (" + keepHeating[0].name + ")", keepHeating[1].id);
    // Keeping the chain linked
    keepHeating[0].next = tminus30.id;

    recipe.addStep(keepHeating[0]);
    recipe.addStep(new IngredientStep(
        'Hop Addition',
        new Supply.Ing(Entities.columbusHop, IngType.Hops, [Dim.Mass]),
        new Quantity(50, SI.sym('g'))));
    recipe.addStep(tminus30);
    recipe.addStep(new IngredientStep(
        'Hop Addition',
        new Supply.Ing(Entities.columbusHop, IngType.Hops, [Dim.Mass]),
        new Quantity(50, SI.sym('g'))));
    recipe.addStep(keepHeating[1]);
    recipe.addStep(new IngredientStep(
        'Hop Addition',
        new Supply.Ing(Entities.columbusHop, IngType.Hops, [Dim.Mass]),
        new Quantity(50, SI.sym('g'))));

    var cool:CoolingStep[] = CoolingStep.create("Cool to 22c");
    recipe.addStep(cool[0]);
    recipe.addStep(cool[1]);

    recipe.addStep(new EquipmentStep(equip.getById("user:6galBottlingBucket")));
    recipe.addStep(new MiscStep("Decantation"));
    recipe.addStep(new MiscStep("Mod. Aeration"));
    recipe.addStep(new IngredientStep(
        'Add Yeast',
        new Supply.Ing(Entities.us05, IngType.Yeast, [Dim.Unit]),
        new Quantity(1, SI.sym('u'))));

    var ferm:FermentationStep[] = FermentationStep.create("1st Fermentation");
    recipe.addStep(ferm[0]);

    recipe.addStep(new IngredientStep(
        'Hop Addition',
        new Supply.Ing(Entities.columbusHop, IngType.Hops, [Dim.Mass]),
        new Quantity(50, SI.sym('g'))));

    recipe.addStep(ferm[1]);

    recipe.addStep(new EquipmentStep(equip.getById("user:5galCarboy")));
    recipe.addStep(new MiscStep("Decantation Filtering"));

    var ferm2:FermentationStep[] = FermentationStep.create("1st Fermentation");
    recipe.addStep(ferm2[0]);
    recipe.addStep(ferm2[1]);
    recipe.addStep(new MiscStep("Decantation Filtering"));


    recipe.addStep(new IngredientStep(
        'Priming Sugar',
        new Supply.Ing(Entities.tableSugar, IngType.Fermentable, [Dim.Mass]),
        new Quantity(50, SI.sym('g'))));

    recipe.addStep(new EquipmentStep(equip.getById("user:grolshBottles")));

    return recipe;
  }

  public saveRecipe() {
    localStorage.setItem('recipe', JSON.stringify(this.recipe));
  }

  public loadRecipe() {
    var json = JSON.parse(localStorage.getItem('recipe'));
    this.recipe = Recipe.decode(json);
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