/// <reference path="../../../lib/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AppShortcuts = (function (_super) {
    __extends(AppShortcuts, _super);
    function AppShortcuts() {
        _super.apply(this, arguments);
    }
    AppShortcuts.prototype.ready = function () {
        console.log('Hello World from AppMw');
    };
    return AppShortcuts;
})(Polymer.DomModule);
window.Polymer(window.Polymer.Base.extend(AppShortcuts.prototype, {
    is: 'app-mw'
}));
