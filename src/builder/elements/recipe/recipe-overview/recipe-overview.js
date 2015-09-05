/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RecipeOverview = (function (_super) {
    __extends(RecipeOverview, _super);
    function RecipeOverview() {
        _super.apply(this, arguments);
    }
    RecipeOverview.prototype.recipeChanged = function () {
        this.current = this.recipe.reactors[0];
    };
    return RecipeOverview;
})(Polymer.DomModule);
window.Polymer(window.Polymer.Base.extend(RecipeOverview.prototype, {
    is: 'recipe-overview',
    properties: {
        recipe: {
            type: Object,
            notify: true,
            observer: 'recipeChanged'
        },
        current: {
            type: Object
        },
        selected: {
            type: Number,
            value: 0
        }
    }
}));
