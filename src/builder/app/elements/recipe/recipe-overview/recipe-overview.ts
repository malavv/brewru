/// <reference path="../../../src/defs/polymer/polymer.ts" />
/// <reference path="../../../src/reactor.ts" />
/// <reference path="../../../src/recipe.ts" />

class RecipeOverview extends Polymer.DomModule {
  current: Reactor;
  recipe: any;
  properties: any;

  recipeChanged() {
    this.current = this.recipe.reactors[0];
  }
}

window.Polymer(window.Polymer.Base.extend(RecipeOverview.prototype, {
  is: 'recipe-overview',

  properties: {
    recipe: {
      type: Recipe,
      notify: true,
      observer: 'recipeChanged'
    },
    current: Reactor,
    selected: {
      type: Number,
      value: 0
    }
  },

  listeners: {
  }
}));