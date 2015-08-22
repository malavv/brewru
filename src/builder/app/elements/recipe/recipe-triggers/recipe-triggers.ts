/// <reference path="../../../src/defs/polymer/polymer.ts" />

/// <reference path="../../../src/recipe.ts" />
/// <reference path="../../../src/base/eventBus.ts" />

/** Lists all the triggers to which something can be bound. */
class RecipeTriggers extends Polymer.DomModule {
  public triggers: Array<Step>;

  ready() {
    bus.suscribe(MessageType.RecipeChanged, this._recipeChanged, this);
  }

  _recipeChanged() {
    console.log('recipe');
    this.set('triggers', this.triggers.slice());
	}
}

window.Polymer(window.Polymer.Base.extend(RecipeTriggers.prototype, {
  is: 'recipe-triggers',

  properties: {
    triggers: {
      type: Array,
      notify: true
    }
  }
}));