/// <reference path="base/conceptRef.ts" />
/// <reference path="ingredientSrc.ts" />
/// <reference path="ingredient.ts" />
/// <reference path="ingredients.ts" />
/// <reference path="entities.ts" />
/// <reference path="recipe.ts" />
/// <reference path="base/eventBus.ts" />
/// <reference path="base/messageType.ts" />
/// <reference path="base/quantity.ts" />
/// <reference path="units/system.ts" />

class RecipeBuilder {
	inventory: IngredientSrc = null;
	ingredients: Ingredients = null;
	recipe: Recipe = null;

	constructor() {
		this.inventory = this.fetchInventory();
	    this.ingredients = new Ingredients();
	    this.recipe = new Recipe(undefined);

	    // Fake first item
	    this.recipe.reactors[0].steps.push(new Step('Add Water', 'Add Ingredient'));

		bus.suscribe(
	      MessageType.NewStepCreated,
	      this.onNewStepCreated,
	      this
	    );
	}

	onNewStepCreated(a:any) {
	    this.recipe.reactors[0].steps.push(new Step(a.name, 'Add Ingredient'));
	    bus.publish(MessageType.RecipeChanged);
		console.log('StepState[Finish]', a);
	}

	fetchInventory() : IngredientSrc {
		var src = new IngredientSrc(Entities.inventory);

		return src.addAll([
	    	new Ingredient(Entities.tapWater, new Quantity(Infinity, SI.sym('l'))),
	      	new Ingredient(Entities.syrup, new Quantity(2.4, SI.sym('kg'))),
	      	new Ingredient(Entities.syrup, new Quantity(2.4, SI.sym('kg'))),
	      	new Ingredient(Entities.c120, new Quantity(0.16, SI.sym('kg'))),
	      	new Ingredient(Entities.c60, new Quantity(0.14, SI.sym('kg'))),
	      	new Ingredient(Entities.paleChoco, new Quantity(0.14, SI.sym('kg'))),
	      	new Ingredient(Entities.blackMalt, new Quantity(0.14, SI.sym('kg'))),
	      	new Ingredient(Entities.flakedRye, new Quantity(0.14, SI.sym('kg'))),
	      	new Ingredient(Entities.rolledOat, new Quantity(0.14, SI.sym('kg')))
	    ]);
	}
}