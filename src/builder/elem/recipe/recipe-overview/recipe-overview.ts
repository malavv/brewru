/// <reference path="../../../src/recipeBuilder.ts" />
/// <reference path="../../../src/reactor.ts" />

var Polymer:Function = Polymer || function () {}

class RecipeOverview {
  builder: RecipeBuilder;
  current: Reactor;
  $: any;
  
  ready() {
    window.addEventListener('keyup', this.$.shortcuts.keypress.bind(this.$.shortcuts), true);
    this.builder = new RecipeBuilder();
    this.current = this.builder.recipe.reactors[0];
  }
}

Polymer(RecipeOverview.prototype);