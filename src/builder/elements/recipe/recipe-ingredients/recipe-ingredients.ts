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

  private _onInventoryChanged() {
    this.async(() => {
      console.info("RecipeItems updating listing.")
      this.items = this.inventory.listItem();
    });
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
      type: Array
    }
  }
}));