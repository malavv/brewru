/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class RecipeCode extends Polymer.DomModule {
  recipe: Recipe;

  public jsonify() {
    console.log('jsonify');
    return JSON.stringify(this.recipe, undefined, 2);
  }
}

window.Polymer(window.Polymer.Base.extend(RecipeCode.prototype, {
  is: 'recipe-code',

  properties: {
    recipe: Object
  }
}));