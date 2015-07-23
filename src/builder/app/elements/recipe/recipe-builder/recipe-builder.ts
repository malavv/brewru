/// <reference path="../../../src/defs/polymer/polymer.ts" />

/// <reference path="../../../src/ingredient.ts" />
/// <reference path="../../../src/ingredients.ts" />
/// <reference path="../../../src/recipe.ts" />
/// <reference path="../../../src/base/eventBus.ts" />

class RecipeBuilder extends Polymer.DomModule {
  inventory: IngredientSrc;
  ingredients: Ingredients;
  recipe: Recipe;
  
  ready() {
	 this.inventory = this._fetchInventory();
	 this.ingredients = new Ingredients();
	 this.recipe = new Recipe(undefined);
	
	 bus.suscribe(MessageType.NewStepCreated, this._onNewStepCreated, this);
  }
  
  private _onNewStepCreated(config: {name:string; type:ConceptRef}) {
    this.recipe.reactors[0].steps.push(new Step(config.name, config.type));
    bus.publish(MessageType.RecipeChanged);
  }
	
  private _fetchInventory() : IngredientSrc {
    var src = new IngredientSrc(Entities.inventory);
	
	return src.addAll([
	  new Ingredient(Entities.syrup, IngredientType.Fermentables),
	  new Ingredient(Entities.c120, IngredientType.Fermentables),
	  new Ingredient(Entities.c60, IngredientType.Fermentables),
	  new Ingredient(Entities.paleChoco, IngredientType.Fermentables),
	  new Ingredient(Entities.blackMalt, IngredientType.Fermentables),
	  new Ingredient(Entities.flakedRye, IngredientType.Fermentables),
	  new Ingredient(Entities.rolledOat, IngredientType.Fermentables),
	  new Ingredient(Entities.yeastNutrient, IngredientType.Miscellaneous),
	  new Ingredient(Entities.w2112, IngredientType.Yeasts),
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
    }
  }
}));