/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class RecipeComputed extends Polymer.DomModule {
  recipe: Recipe;

  public jsonify() {
    return JSON.stringify(this.recipe.data, undefined, 2);
  }
}

window.Polymer(window.Polymer.Base.extend(RecipeComputed.prototype, {
  is: 'recipe-computed',

  properties: {
    recipe: Object
  }
}));