/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class RecipeCode extends Polymer.DomModule {
  code: string;
  recipe: Recipe;

  ready() {
    console.log('[RecipeCode]<ready>');
    this.code = JSON.stringify({
      "id": "user_00001:0001"
    }, undefined, 2);
  }

  public jsonify() {
    return JSON.stringify(this.recipe, undefined, 2);
  }
}

window.Polymer(window.Polymer.Base.extend(RecipeCode.prototype, {
  is: 'recipe-code',

  properties: {
    recipe: {
      type: Object
    }
  }
}));