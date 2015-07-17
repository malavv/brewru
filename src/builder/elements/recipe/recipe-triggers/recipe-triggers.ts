/// <reference path="../../../src/defs/polymer/polymer.ts" />

class RecipeTriggers extends Polymer.DomModule {
  ready() {}
}

RecipeTriggers.prototype.is = 'recipe-triggers';

RecipeTriggers.prototype.properties = {
  triggers: {
    type: Object,
    value: undefined
  }
}