/// <reference path="../../../src/defs/polymer/polymer.ts" />
/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/base/codes.ts" />
/// <reference path="../../../src/errors.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AppMenuWrapper = (function () {
    function AppMenuWrapper(val) {
        this.val = val;
    }
    AppMenuWrapper.prototype.toString = function () { return this.val; };
    return AppMenuWrapper;
})();
/**
 * Enables Pop-Up selection from a list of items.
 *
 *  Two selection interfaces are available.
 *    - Select by pressing the index of the item.
 *    - Clicking on the item.
 *  Can be canceled using the 'cancel' bus event.
 *  Result:
 *    On closing the menu without a selection, it will send a bus event
 *    with a null item.
 */
var AppMenu = (function (_super) {
    __extends(AppMenu, _super);
    function AppMenu() {
        _super.apply(this, arguments);
        this.items = [];
        this.selection = undefined;
    }
    AppMenu.prototype.ready = function () {
        bus.suscribe(MessageType.AskMenu, this.onAskMenu, this);
        bus.suscribe(MessageType.Cancel, this.onCancel, this);
        this.hidden = true;
    };
    /** On request made. */
    AppMenu.prototype.onAskMenu = function (data) {
        this.items = data;
        this.open();
    };
    /** On cancel received. */
    AppMenu.prototype.onCancel = function () {
        if (this.$.overlay.opened)
            this.$.overlay.close();
    };
    /** Main closing exit point. */
    AppMenu.prototype.onOverlayClosed = function () {
        this.close();
    };
    AppMenu.prototype.selectionChanged = function (oldVal, newVal) {
        if (newVal === undefined)
            return;
        this.$.overlay.close();
    };
    AppMenu.prototype.close = function () {
        this.$.list.looseFocus();
        this.hidden = true;
        this.items = [];
        bus.publish(MessageType.AnswerMenu, AppMenu.unwrap(this.selection));
    };
    AppMenu.prototype.open = function () {
        this.$.list.grabFocus();
        this.hidden = false;
        this.$.overlay.open();
    };
    AppMenu.unwrap = function (data) {
        return data instanceof AppMenuWrapper ? data.val : data;
    };
    return AppMenu;
})(Polymer.DomModule);
AppMenu.prototype.is = 'app-menu';
AppMenu.prototype.properties = {};
AppMenu.prototype.behaviors = [
    Polymer.IronOverlayBehavior
];
