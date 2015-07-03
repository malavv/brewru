/// <reference path="../../../src/recipeBuilder.ts" />

class RecipeBld {
  builder:RecipeBuilder;

  ready() {
    this.builder = new RecipeBuilder();
  }
}