/// <reference path="../../../src/base/polymer.d.ts" />

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