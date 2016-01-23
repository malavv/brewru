/// <reference path="../../../lib/polymer/polymer.ts" />

class RecipeReactor extends Polymer.DomModule {
  _recipeChanged() {
    this.buildingSteps = this.recipe.steps;
  }
}

window.Polymer(window.Polymer.Base.extend(RecipeReactor.prototype, {
  is: 'recipe-reactor',

  properties: {
    recipe: {
      type: Object,
      observer: '_recipeChanged'
    },
    buildingSteps: {
      type: Array
    }
  }
}));