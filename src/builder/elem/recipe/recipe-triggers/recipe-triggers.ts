/// <reference path="../../../src/base/polymer.d.ts" />

class RecipeTriggers {
  is:string = 'recipe-triggers';
  
  properties:any = {
    triggers: {
      type: Object,
      value: undefined
    }
  }
  ready() {}
}