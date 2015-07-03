/// <reference path="../../../src/reactor.ts" />
/// <reference path="../../../src/recipe.ts" />

class RecipeOverview {
  recipe:Recipe;
  current:Reactor;

  recipeChanged() {
    this.current = this.recipe.reactors[0];
  }
}
