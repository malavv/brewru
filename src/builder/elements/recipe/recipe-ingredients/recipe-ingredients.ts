/// <reference path="../../../src/defs/polymer/polymer.ts" />

/// <reference path="../../../src/ingredients.ts" />
/// <reference path="../../../src/ingredient.ts" />
/// <reference path="../../../src/recipe.ts" />
/// <reference path="../../../src/base/quantity.ts" />
/// <reference path="../../../src/units/system.ts" />

interface InventoryItem {
  qty: Quantity;
  ingredient: Ingredient;
}

class InventoryMatchedIngredients {
  ingredient: Ingredient;
  stocks: InventoryItem[];
  constructor(ingredient: Ingredient, stocks: InventoryItem[]) {
    this.ingredient = ingredient;
    this.stocks = stocks;
  }
}

class RecipeIngredients extends Polymer.DomModule {  
  dynamic: InventoryMatchedIngredients[];
  fermentables: InventoryMatchedIngredients[];
  hops: InventoryMatchedIngredients[];
  yeasts: InventoryMatchedIngredients[];
  miscellaneous: InventoryMatchedIngredients[];
  inventory: IngredientSrc;
  
  ready() {
    var 
      tapWater: Ingredient = new Ingredient(OntoRef.createAnon("tap water"), null),
      tapQty: Quantity = new Quantity(Infinity, SI.sym('l'));
      
    this.dynamic = [
      new InventoryMatchedIngredients(tapWater, [{qty: tapQty, ingredient: tapWater}])
    ];
    this.fermentables = [];
    this.hops = [];
    this.yeasts = [];
    this.miscellaneous = [];
  }

  inventoryChanged() {
    this.fermentables = [];
    this.hops = [];
    this.yeasts = [];
    this.miscellaneous = [];
    
    this.inventory.stocks.forEach((i:Ingredient) => {
      switch (i.type) {
        case IngredientType.Fermentables:
          this.fermentables.push(new InventoryMatchedIngredients(i, []));     
          break;
        case IngredientType.Hops:
          this.hops.push(new InventoryMatchedIngredients(i, []));
          break;        
        case IngredientType.Yeasts: 
          this.yeasts.push(new InventoryMatchedIngredients(i, []));
          break;
        case IngredientType.Miscellaneous: 
          this.miscellaneous.push(new InventoryMatchedIngredients(i, []));
          break;
        default:
          console.warn('[RecipeIngredients]<inventoryChanged> Unknown ingredient type'); 
          break;
      }
    });
    console.log('verify');
  }
  
  recipeChanged() {}
}

RecipeIngredients.prototype.is = 'recipe-ingredients';

RecipeIngredients.prototype.listeners = {}

RecipeIngredients.prototype.properties = {
  inventory: {
    type: IngredientSrc,
    value: null,
    observer: 'inventoryChanged'
  },
  recipe: {
    type: Recipe,
    value: null,
    observer: 'recipeChanged'
  },
  dynamic: {
    type: Array,
    value: []
  },
  fermentables: Array,
  hops: Array,
  yeasts: Array,
  miscellaneous: Array,
  test: {
    Array,
    value: [{a:1}, {a:2}, {a:3}]
  }
}