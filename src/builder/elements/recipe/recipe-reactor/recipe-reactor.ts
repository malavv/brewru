/// <reference path="../../../src/defs/polymer/polymer.ts" />

class RecipeReactor {
  is:string = 'recipe-reactor';
  reactor: any;
  
  properties: any = {
    reactor: {
      type: Object,
      value: undefined
    }
  }
  
  ready() {}
}