/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AppSplash = (function (_super) {
    __extends(AppSplash, _super);
    function AppSplash() {
        _super.apply(this, arguments);
    }
    AppSplash.prototype.ready = function () {
        this.isChoosing = false;
    };
    AppSplash.prototype.createNew = function () {
        bus.publish(MessageType.RecipeSelected, null);
    };
    AppSplash.prototype.loadRecipe = function () {
        this.isChoosing = true;
    };
    AppSplash.prototype._onRecipeSelected = function (evt) {
        bus.publish(MessageType.RecipeSelected, evt.target.files[0]);
    };
    return AppSplash;
})(Polymer.DomModule);
window.Polymer(window.Polymer.Base.extend(AppSplash.prototype, {
    is: 'app-splash',
    properties: {
        isChoosing: Boolean
    }
}));
