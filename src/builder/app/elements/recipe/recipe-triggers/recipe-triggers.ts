/// <reference path="../../../src/defs/polymer/polymer.ts" />

/// <reference path="../../../src/recipe.ts" />
/// <reference path="../../../src/base/eventBus.ts" />

class RecipeTriggers extends Polymer.DomModule {
  triggers: Array<Step>;
  
  ready() {
    bus.suscribe(MessageType.RecipeChanged, this._recipeChanged, this);
  }
  
  _recipeChanged() {
    this.triggers = [].concat(this.triggers);
	}
}

window.Polymer(window.Polymer.Base.extend(RecipeTriggers.prototype, {
  is: 'recipe-triggers',

  properties: {
    triggers: Array,
    notify: true
  }
}));