/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RecipeEditor = (function (_super) {
    __extends(RecipeEditor, _super);
    function RecipeEditor() {
        _super.apply(this, arguments);
    }
    return RecipeEditor;
})(Polymer.DomModule);
window.Polymer(window.Polymer.Base.extend(RecipeEditor.prototype, {
    is: 'recipe-editor',
    properties: {}
}));
