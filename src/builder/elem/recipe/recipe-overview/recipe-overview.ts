/// <reference path="../../../src/reactor.ts" />
/// <reference path="../../../src/recipe.ts" />

class RecipeOverview {
  is:string = 'recipe-overview';
  recipe:Recipe;
  current:Reactor;

  properties:any = {
    recipe: {
      type: Recipe,
      value: undefined
    }
  }

  recipeChanged() {
    this.current = this.recipe.reactors[0];
  }
}
