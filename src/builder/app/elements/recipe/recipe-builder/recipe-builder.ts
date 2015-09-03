/// <reference path="../../../src/defs/polymer/polymer.ts" />

/// <reference path="../../../src/supply/ingredient.ts" />
/// <reference path="../../../src/ingredients.ts" />
/// <reference path="../../../src/recipe.ts" />
/// <reference path="../../../src/base/eventBus.ts" />

interface Window { builder: any; };

class RecipeBuilder extends Polymer.DomModule {
  inventory: IngredientSrc;
  ingredients: Ingredients;
  recipe: Recipe;
  ws: WebSocket;
  isConnected: Boolean;

  ready() {
	  this.inventory = this._fetchInventory();
	  this.ingredients = new Ingredients();
	  this.recipe = new Recipe();
    this.ws = new WebSocket("ws://localhost:8080/socket");
    this.ws.onopen = this.onSocketOpen;
    this.ws.onclose = this.onSocketClosed;

	  bus.suscribe(MessageType.NewStepCreated, this._onNewStepCreated, this);

    window.builder = this;
  }

  onSocketOpen() {
    var toast = document.querySelector('#toast1');
    toast.text = "Connected";
    toast.show();
    this.isConnected = true;
  }
  onSocketClosed() {
    var toast = document.querySelector('#toast1');
    toast.text = "Error : Connection could not be established.";
    toast.show();
    this.isConnected = false;
  }

  public saveRecipe() {
    localStorage.setItem('recipe', JSON.stringify(this.recipe));
  }

  public loadRecipe() {
    var json = JSON.parse(localStorage.getItem('recipe'));
    var newRecipe = Recipe.decode(json);
    this.recipe = newRecipe;
  }

  private _onNewStepCreated(config: {name:string; type:ConceptRef}) {
    this.push('recipe.reactors.0.steps', new Step(config.name, config.type));
    bus.publish(MessageType.RecipeChanged);
  }

  private _fetchInventory() : IngredientSrc {
    var src = new IngredientSrc(Entities.inventory);

	return src.addAll([
	  new Supply.Ing(Entities.syrup, Supply.IngType.Fermentable, [Dim.Volume]),
    new Supply.Ing(Entities.dme, Supply.IngType.Fermentable, [Dim.Volume]),
	  new Supply.Ing(Entities.c120, Supply.IngType.Fermentable, [Dim.Mass]),
	  new Supply.Ing(Entities.c60, Supply.IngType.Fermentable, [Dim.Mass]),
	  new Supply.Ing(Entities.paleChoco, Supply.IngType.Fermentable, [Dim.Mass]),
	  new Supply.Ing(Entities.blackMalt, Supply.IngType.Fermentable, [Dim.Mass]),
	  new Supply.Ing(Entities.flakedRye, Supply.IngType.Fermentable, [Dim.Mass]),
	  new Supply.Ing(Entities.rolledOat, Supply.IngType.Fermentable, [Dim.Mass]),
	  new Supply.Ing(Entities.yeastNutrient, Supply.IngType.Miscellaneous, [Dim.Volume]),
	  new Supply.Ing(Entities.w2112, Supply.IngType.Yeast),
	]);
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
    },
    ws: {
      type: Object
    },
    isConnected: {
      type: Boolean,
      value: null,
      notify: true
    }
  }
}));