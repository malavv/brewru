/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Presents the items available for this recipe.
 */
var RecipeItems = (function (_super) {
    __extends(RecipeItems, _super);
    function RecipeItems() {
        _super.apply(this, arguments);
    }
    RecipeItems.prototype.ready = function () {
        bus.suscribe(MessageType.InventoryChanged, this._onInventoryChanged, this);
    };
    RecipeItems.prototype._onInventoryChanged = function () {
        var _this = this;
        this.async(function () {
            console.info("RecipeItems updating listing.");
            _this.items = _this.inventory.listItem();
        });
    };
    return RecipeItems;
})(Polymer.DomModule);
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
        },
    }
}));
