/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/base/keyboard.ts" />
/// <reference path="../../../src/base/messageType.ts" />
/// <reference path="../../../src/defs/polymer/polymer.ts" />
/// <reference path="../../../src/shortcuts.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Shortcuts for this application.
 * Note<malavv> : Not sure why it is there.
 */
var shortcuts = new Shortcuts()
    .add('alt+S', MessageType.CreateStep, 'Create new step')
    .add('shift+6', MessageType.ShowShortcuts, 'Toggle Visibility of Shortcuts')
    .add('esc', MessageType.Cancel, 'Cancel current action.');
/**
 * Manages presenting available shortcuts and feeding them in PubSub.
 */
var AppShortcuts = (function (_super) {
    __extends(AppShortcuts, _super);
    function AppShortcuts() {
        _super.apply(this, arguments);
    }
    AppShortcuts.prototype.ready = function () {
        var _this = this;
        this.listed = shortcuts;
        this.opened = false;
        window.addEventListener('keyup', function (e) { _this.onKeyUp(e); }, false);
        bus.suscribe(MessageType.ShowShortcuts, function () { _this.opened = true; }, this);
    };
    /**
     * On all key in the application (Using key-up to also get none aphabetic keys.)
     * @param event Keyboard event of the pressed key.
     */
    AppShortcuts.prototype.onKeyUp = function (event) {
        var key = Keyboard.fromEvt(event);
        if (!this.listed.hasKey(key))
            return;
        bus.publish(this.listed.get(key).intent);
    };
    return AppShortcuts;
})(Polymer.DomModule);
AppShortcuts.prototype.is = 'app-shortcuts';
/** Creates an automatic overlay using "opened" and closing automatically. */
AppShortcuts.prototype.behaviors = [Polymer.IronOverlayBehavior];
