/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AppMainWindow = (function (_super) {
    __extends(AppMainWindow, _super);
    function AppMainWindow() {
        _super.apply(this, arguments);
    }
    AppMainWindow.prototype.ready = function () {
        this.selectedSidebar = 0;
        console.log('Hello World from AppMw');
        // Pushing to shortcuts for the shortcut behavior.
        this.shortcuts.forEach(function (shortcut) {
            this.addShortcut(shortcut.binding, shortcut.type);
        }, this);
        bus.suscribe(MessageType.ShowShortcuts, this._onShowShortcuts, this);
    };
    AppMainWindow.prototype._onShowShortcuts = function () {
        var _this = this;
        this.async(function () { _this.$.shortcutsPanel.open(); });
    };
    return AppMainWindow;
})(Polymer.DomModule);
window.Polymer(window.Polymer.Base.extend(AppMainWindow.prototype, {
    is: 'app-mw',
    behaviors: [
        ShortcutBehavior
    ],
    properties: {
        shortcuts: {
            type: Array,
            value: function () {
                return [
                    {
                        binding: 'shift+6',
                        description: 'Show Shortcut',
                        type: MessageType.ShowShortcuts
                    },
                    {
                        binding: 'alt+S',
                        description: 'Create new step',
                        type: MessageType.CreateStep
                    },
                    {
                        binding: 'esc',
                        description: 'Cancel current Action',
                        type: MessageType.Cancel
                    }
                ];
            }
        }
    }
}));
