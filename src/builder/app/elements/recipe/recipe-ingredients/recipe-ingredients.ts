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

    this.async(() => { 
      this.dynamic = [new InventoryMatchedIngredients(tapWater, [{qty: tapQty, ingredient: tapWater}])];
      this.fermentables = [];
      this.hops = [];
      this.yeasts = [];
      this.miscellaneous = [];
    }, 1);
  }

  inventoryChanged() {
    var createInventoryItem = (i: Ingredient) => new InventoryMatchedIngredients(i, []);

    this.async(() => {
      this.fermentables = this.inventory.stocks.filter((i: Ingredient) => i.type === IngredientType.Fermentables).map(createInventoryItem);
      this.hops = this.inventory.stocks.filter((i: Ingredient) => i.type === IngredientType.Hops).map(createInventoryItem);
      this.yeasts = this.inventory.stocks.filter((i: Ingredient) => i.type === IngredientType.Yeasts).map(createInventoryItem);
      this.miscellaneous = this.inventory.stocks.filter((i: Ingredient) => i.type === IngredientType.Miscellaneous).map(createInventoryItem);
    }, 1);

    return;
  }

  recipeChanged() {}
}

window.Polymer(window.Polymer.Base.extend(RecipeIngredients.prototype, {
  is: 'recipe-ingredients',

  properties: {
    inventory: {
      type: IngredientSrc,
      observer: 'inventoryChanged'
    },
    recipe: {
      type: Recipe,
      observer: 'recipeChanged'
    },
    dynamic: {
      type: Array
    },
    fermentables: {
      type: Array
    },
    hops: {
      type: Array
    },
    yeasts: {
      type: Array
    },
    miscellaneous: {
      type: Array
    }
  }
}));