/// <reference path="../../../src/defs/polymer/polymer.ts" />

class RecipeReactor extends Polymer.DomModule {
  ready() {}
  changed() {
    console.log('changed');
  }
}

RecipeReactor.prototype.is = 'recipe-reactor';

RecipeReactor.prototype.properties = {
  reactor: {
    type: Object,
    value: undefined,
    observer: 'changed'
  }
}