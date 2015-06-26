/// <reference path="../../../src/base/polymer.d.ts" />
/// <reference path="../../../src/recipeBuilder.ts" />
/// <reference path="../../../src/reactor.ts" />

/// <reference path="../../../src/step/wizard.ts" />

class RecipeOverview {
  builder: RecipeBuilder;
  current: Reactor;
  $: any;
  
  ready() {
    document.addEventListener('keyup', this.$.shortcuts.keypress.bind(this.$.shortcuts), false);
    this.builder = new RecipeBuilder();
    this.current = this.builder.recipe.reactors[0];
  }
}

if (!Polymer.getRegisteredPrototype('recipe-overview')) {
  Polymer('recipe-overview', RecipeOverview.prototype);
}