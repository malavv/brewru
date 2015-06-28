/// <reference path="base/conceptRef.ts" />
/// <reference path="ingredientSrc.ts" />
/// <reference path="ingredient.ts" />
/// <reference path="ingredients.ts" />
/// <reference path="entities.ts" />
/// <reference path="recipe.ts" />
/// <reference path="base/eventBus.ts" />
/// <reference path="base/messageType.ts" />
/// <reference path="base/quantity.ts" />
/// <reference path="step/stepState.ts" />
/// <reference path="units/system.ts" />

class RecipeBuilder {
	inventory: IngredientSrc = null;
	ingredients: Ingredients = null;
	recipe: Recipe = null;

	constructor() {
		this.inventory = this.fetchInventory();
	    this.ingredients = new Ingredients();
	    this.recipe = new Recipe(undefined);

		bus.suscribe(
	      MessageType.NewStepCreated,
	      this.onNewStepCreated,
	      this
	    );
	}

	onNewStepCreated(a:StepState) {
	    this.recipe.reactors[0].steps.push(new Step(a.name, a.type));
	    bus.publish(MessageType.RecipeChanged);
		console.log('StepState[Finish]', a);
	}

	fetchInventory() : IngredientSrc {
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