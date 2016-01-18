/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

/**
 * Presents the items available for this recipe.
 */
class RecipeItems extends Polymer.DomModule {
  private inventory: Inventory;
  private items: Item[];
  private recipe: Recipe;

  public ready() {
    bus.suscribe(MessageType.InventoryChanged, this._onInventoryChanged, this);
  }

  private contains(arr: Array<any>, elements: any) {
    return arr.indexOf(elements) != -1;
  }

  private _onInventoryChanged() {
    var newList = this.inventory.listItem();
    var removedList = this.items.filter(item => !this.contains(newList, item.ref), this);
    var addedList = newList.filter(item => !this.contains(this.items, item.ref), this);

    addedList.forEach(item => {
      this.async(() => {
        this.push('items', item)
      }, 1);
    }, this);
    console.info("RecipeItems updating listing adding : " + addedList.length + " removed : " + removedList.length + " newlist ");
  }
}

window.Polymer(window.Polymer.Base.extend(RecipeItems.prototype, {
  is: 'recipe-ingredients',

  properties: {
    inventory: {
      type: Object
    },
    recipe: {
      type: Object
    },
    items: {
      type: Array,
      value: function(): Array<Object> { return []; }
    }
  }
}));