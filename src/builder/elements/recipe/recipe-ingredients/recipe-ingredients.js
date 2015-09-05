/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var InventoryMatchedIngredients = (function () {
    function InventoryMatchedIngredients(ingredient, stocks) {
        this.ingredient = ingredient;
        this.stocks = stocks;
    }
    return InventoryMatchedIngredients;
})();
var RecipeIngredients = (function (_super) {
    __extends(RecipeIngredients, _super);
    function RecipeIngredients() {
        _super.apply(this, arguments);
    }
    RecipeIngredients.prototype.ready = function () {
        var _this = this;
        var tapWater = new Supply.Ing(OntoRef.createAnon("tap water"), null), tapQty = new Quantity(Infinity, SI.sym('l'));
        this.async(function () {
            _this.dynamic = [new InventoryMatchedIngredients(tapWater, [{ qty: tapQty, ingredient: tapWater }])];
            _this.fermentables = [];
            _this.hops = [];
            _this.yeasts = [];
            _this.miscellaneous = [];
        }, 1);
        bus.suscribe(MessageType.InventoryChanged, this._onInventoryChanged, this);
    };
    RecipeIngredients.prototype.typeToLetter = function (type) {
        switch (type) {
            case 0: return 'F';
            case 1: return 'H';
            case 2: return 'Y';
            case 3: return 'M';
            case 4: return 'D';
        }
    };
    RecipeIngredients.prototype.truncate = function (text) {
        var ellipsis = '...';
        var max = 25;
        return text.length > (max + ellipsis.length)
            ? text.substring(0, max) + ellipsis
            : text;
    };
    RecipeIngredients.prototype._onInventoryChanged = function () {
        var _this = this;
        this.async(function () {
            _this.fermentables = _this.inventory.listItem(ItemType.Fermentables);
        });
        console.log('recipe ingredient received inventory changed event.');
    };
    RecipeIngredients.prototype.inventoryChanged = function () {
        var _this = this;
        var createInventoryItem = function (i) { return new InventoryMatchedIngredients(i, []); };
        this.async(function () {
            _this.fermentables = _this._getByType(Supply.IngType.Fermentable).map(createInventoryItem);
            _this.hops = _this._getByType(Supply.IngType.Hops).map(createInventoryItem);
            _this.yeasts = _this._getByType(Supply.IngType.Yeast).map(createInventoryItem);
            _this.miscellaneous = _this._getByType(Supply.IngType.Miscellaneous).map(createInventoryItem);
        }, 1);
    };
    RecipeIngredients.prototype._getByType = function (type) {
        return this.inventory.stocks.filter(function (i) { return i.type() === type; });
    };
    return RecipeIngredients;
})(Polymer.DomModule);
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
