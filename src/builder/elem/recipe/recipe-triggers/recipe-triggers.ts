/// <reference path="../../../src/base/polymer.d.ts" />

class RecipeTriggers {
  ready() {}
}

if (!Polymer.getRegisteredPrototype('recipe-triggers')) {
  Polymer('recipe-triggers', RecipeTriggers.prototype);
}