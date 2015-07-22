/// <reference path="../../../src/defs/polymer/polymer.ts" />

class RecipeReactor extends Polymer.DomModule {
}

window.Polymer(window.Polymer.Base.extend(RecipeReactor.prototype, {
  is: 'recipe-reactor',

  properties: {
    reactor: Object
  }
}));