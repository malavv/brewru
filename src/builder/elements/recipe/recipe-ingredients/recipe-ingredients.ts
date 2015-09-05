/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

interface InventoryItem {
  qty: Quantity;
  ingredient: Supply.Ing;
}

class InventoryMatchedIngredients {
  ingredient: Supply.Ing;
  stocks: InventoryItem[];
  constructor(ingredient: Supply.Ing, stocks: InventoryItem[]) {
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
  inventory: Inventory;

  ready() {
    var
      tapWater: Supply.Ing = new Supply.Ing(OntoRef.createAnon("tap water"), null),
      tapQty: Quantity = new Quantity(Infinity, SI.sym('l'));

    this.async(() => {
      this.dynamic = [new InventoryMatchedIngredients(tapWater, [{qty: tapQty, ingredient: tapWater}])];
      this.fermentables = [];
      this.hops = [];
      this.yeasts = [];
      this.miscellaneous = [];
    }, 1);

    bus.suscribe(MessageType.InventoryChanged, this._onInventoryChanged, this);
  }

  typeToLetter(type: ItemType): string {
    switch (type) {
      case 0: return 'F';
      case 1: return 'H';
      case 2: return 'Y';
      case 3: return 'M';
      case 4: return 'D';
    }
  }

  truncate(text: string) {
    var ellipsis = '...';
    var max = 25;
    return text.length > (max + ellipsis.length)
      ? text.substring(0, max) + ellipsis
      : text;
  }

  private _onInventoryChanged() {
    this.async(() => {
      this.fermentables = this.inventory.listItem(ItemType.Fermentables);
    });
    console.log('recipe ingredient received inventory changed event.');
  }

  inventoryChanged() {
    var createInventoryItem = (i: Supply.Ing) => new InventoryMatchedIngredients(i, []);

    this.async(() => {
      this.fermentables = this._getByType(Supply.IngType.Fermentable).map(createInventoryItem);
      this.hops = this._getByType(Supply.IngType.Hops).map(createInventoryItem);
      this.yeasts = this._getByType(Supply.IngType.Yeast).map(createInventoryItem);
      this.miscellaneous = this._getByType(Supply.IngType.Miscellaneous).map(createInventoryItem);
    }, 1);
  }

  _getByType(type:Supply.IngType) : Supply.Ing[] {
    return this.inventory.stocks.filter((i: Supply.Ing) => i.type() === type);
  }
}

window.Polymer(window.Polymer.Base.extend(RecipeIngredients.prototype, {
  is: 'recipe-ingredients',

  properties: {
    inventory: {
      type: Object,
      observer: 'inventoryChanged'
    },
    recipe: {
      type: Recipe
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