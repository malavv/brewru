/// <reference path="../../../src/recipeBuilder.ts" />
/// <reference path="../../../src/reactor.ts" />

/// <reference path="../../../src/step/wizard.ts" />

var Polymer:Function = Polymer || function () {}

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

Polymer(RecipeOverview.prototype);