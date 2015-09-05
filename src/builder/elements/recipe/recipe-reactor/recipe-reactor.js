/// <reference path="../../../lib/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RecipeReactor = (function (_super) {
    __extends(RecipeReactor, _super);
    function RecipeReactor() {
        _super.apply(this, arguments);
    }
    return RecipeReactor;
})(Polymer.DomModule);
window.Polymer(window.Polymer.Base.extend(RecipeReactor.prototype, {
    is: 'recipe-reactor',
    properties: {
        reactor: {
            type: Object
        }
    }
}));
