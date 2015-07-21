/// <reference path="../../../src/defs/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RecipeTriggers = (function (_super) {
    __extends(RecipeTriggers, _super);
    function RecipeTriggers() {
        _super.apply(this, arguments);
    }
    RecipeTriggers.prototype.ready = function () { };
    return RecipeTriggers;
})(Polymer.DomModule);
RecipeTriggers.prototype.is = 'recipe-triggers';
RecipeTriggers.prototype.properties = {
    triggers: {
        type: Object,
        value: undefined
    }
};
