/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class RecipeEditor extends Polymer.DomModule {
  _recipeEditorRecipeChanged(oldv, newv) {
    console.log('[RecipeEditor]<_recipeEditorRecipeChanged>', oldv, newv);
  }
}

window.Polymer(window.Polymer.Base.extend(RecipeEditor.prototype, {
  is: 'recipe-editor',

  properties: {
    _selectedEditor: {
      type: Number,
      value: 0
    },
    inventory: {
      type: Object
    },
    recipe: {
      type: Object,
      notify: true,
      observer: '_recipeEditorRecipeChanged'
    }
  }
}));