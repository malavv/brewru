/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

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
      type: Object,
      notify: true,
      observer: 'recipeChanged'
    },
    current: {
      type: Object
    },
    selected: {
      type: Number,
      value: 0
    }
  }
}));