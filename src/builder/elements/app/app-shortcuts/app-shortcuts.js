/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AppShortcuts = (function (_super) {
    __extends(AppShortcuts, _super);
    function AppShortcuts() {
        _super.apply(this, arguments);
    }
    AppShortcuts.prototype.ready = function () {
        this.opened = false;
    };
    AppShortcuts.prototype._showShortcuts = function () {
        this.opened = true;
    };
    AppShortcuts.prototype._createNewStep = function () {
        bus.publish(MessageType.CreateStep);
    };
    return AppShortcuts;
})(Polymer.DomModule);
window.Polymer(window.Polymer.Base.extend(AppShortcuts.prototype, {
    is: 'app-shortcuts',
    behaviors: [
        Polymer.IronOverlayBehavior
    ],
    properties: {
        listed: {
            type: Array,
            value: [
                { binding: 'alt+S', description: 'Create new step' },
                { binding: 'shift+6', description: 'Toggle Visibility of Shortcuts' },
                { binding: 'esc', description: 'Cancel current action' }
            ]
        },
        target: {
            type: Object,
            value: function () { return document.body; }
        }
    }
}));
