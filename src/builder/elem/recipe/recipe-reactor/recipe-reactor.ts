/// <reference path="../../../src/base/polymer.d.ts" />

class RecipeReactor {
  reactor: any;
  
  ready() {}
}

if (!Polymer.getRegisteredPrototype('recipe-reactor')) {
  Polymer('recipe-reactor', RecipeReactor.prototype);
}