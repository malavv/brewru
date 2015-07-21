/// <reference path="../../../src/defs/polymer/polymer.ts" />

/// <reference path="../../../src/reactor.ts" />
/// <reference path="../../../src/recipe.ts" />

class RecipeTools {
  selected: number;
}

window.Polymer(window.Polymer.Base.extend(RecipeTools.prototype, {
  is: 'recipe-tools',

  properties: {
    reactor: Reactor,
    recipe: Recipe,
    selected: {
      type: Number,
      value: 0
    }
  }
}));