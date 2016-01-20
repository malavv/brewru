/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class RecipeDescription extends Polymer.DomModule {
  recipe: Recipe;
}

window.Polymer(window.Polymer.Base.extend(RecipeDescription.prototype, {
  is: 'recipe-description',

  properties: {
    recipe: {
      type: Object,
      notify: true
    }
  }
}));