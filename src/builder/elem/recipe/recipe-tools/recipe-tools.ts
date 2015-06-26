/// <reference path="../../../src/base/polymer.d.ts" />

class RecipeTools {
  selected: number;
  ready() {
    this.selected = 0;
  }
}

if (!Polymer.getRegisteredPrototype('recipe-tools')) {
  Polymer('recipe-tools', RecipeTools.prototype);
}