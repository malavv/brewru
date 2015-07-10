/// <reference path="../../../src/recipeBuilder.ts" />

class RecipeBld {
  is:string = 'recipe-builder';
  builder:RecipeBuilder;

  ready() {
    this.builder = new RecipeBuilder();
  }
}