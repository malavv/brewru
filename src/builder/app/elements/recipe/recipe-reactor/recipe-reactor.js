/// <reference path="../../../src/defs/polymer/polymer.ts" />
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
    RecipeReactor.prototype.ready = function () { };
    RecipeReactor.prototype.changed = function () {
        console.log('changed');
    };
    return RecipeReactor;
})(Polymer.DomModule);
RecipeReactor.prototype.is = 'recipe-reactor';
RecipeReactor.prototype.properties = {
    reactor: {
        type: Object,
        value: undefined,
        observer: 'changed'
    }
};
