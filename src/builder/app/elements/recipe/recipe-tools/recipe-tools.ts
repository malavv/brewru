/// <reference path="../../../src/defs/polymer/polymer.ts" />

/// <reference path="../../../src/reactor.ts" />
/// <reference path="../../../src/recipe.ts" />

class RecipeTools {
  is:string = 'recipe-tools';
  selected: number;
  
  properties:any = {
    reactor: {
      type: Reactor,
      value: undefined
    },
    recipe: {
      type: Recipe,
      value: undefined
    }
  }
  
  ready() {
    this.selected = 0;
  }
}