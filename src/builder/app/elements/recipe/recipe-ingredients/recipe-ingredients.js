/// <reference path="../../../src/defs/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../../src/ingredients.ts" />
/// <reference path="../../../src/ingredient.ts" />
/// <reference path="../../../src/recipe.ts" />
/// <reference path="../../../src/base/quantity.ts" />
/// <reference path="../../../src/units/system.ts" />
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
        var tapWater = new Ingredient(OntoRef.createAnon("tap water"), null), tapQty = new Quantity(Infinity, SI.sym('l'));
        this.dynamic = [
            new InventoryMatchedIngredients(tapWater, [{ qty: tapQty, ingredient: tapWater }])
        ];
        this.fermentables = [];
        this.hops = [];
        this.yeasts = [];
        this.miscellaneous = [];
    };
    RecipeIngredients.prototype.inventoryChanged = function () {
        var _this = this;
        this.fermentables = [];
        this.hops = [];
        this.yeasts = [];
        this.miscellaneous = [];
        this.inventory.stocks.forEach(function (i) {
            switch (i.type) {
                case IngredientType.Fermentables:
                    _this.fermentables.push(new InventoryMatchedIngredients(i, []));
                    break;
                case IngredientType.Hops:
                    _this.hops.push(new InventoryMatchedIngredients(i, []));
                    break;
                case IngredientType.Yeasts:
                    _this.yeasts.push(new InventoryMatchedIngredients(i, []));
                    break;
                case IngredientType.Miscellaneous:
                    _this.miscellaneous.push(new InventoryMatchedIngredients(i, []));
                    break;
                default:
                    console.warn('[RecipeIngredients]<inventoryChanged> Unknown ingredient type');
                    break;
            }
        });
        console.log('verify');
    };
    RecipeIngredients.prototype.recipeChanged = function () { };
    return RecipeIngredients;
})(Polymer.DomModule);
RecipeIngredients.prototype.is = 'recipe-ingredients';
RecipeIngredients.prototype.listeners = {};
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
        Array: Array,
        value: [{ a: 1 }, { a: 2 }, { a: 3 }]
    }
};
