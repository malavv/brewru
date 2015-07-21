/// <reference path="../../../src/defs/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../../src/base/codes.ts" />
var WidgetList = (function (_super) {
    __extends(WidgetList, _super);
    function WidgetList() {
        var _this = this;
        _super.apply(this, arguments);
        this.handle = function (evt) { _this.handleKey(evt); };
    }
    /** Used with loose focus to enable keyboard selection. */
    WidgetList.prototype.grabFocus = function () { window.addEventListener('keypress', this.handle, false); };
    /** Used with grab focus to enable keyboard selection. */
    WidgetList.prototype.looseFocus = function () { window.removeEventListener('keypress', this.handle, false); };
    WidgetList.prototype.handleKey = function (evt) {
        var idx = WidgetList.codes.toIdx(String.fromCharCode(evt.which));
        if (idx < 0 || idx >= this.data.length)
            return;
        this.$.list.selectItem(idx);
        evt.preventDefault();
    };
    /** On request made. */
    WidgetList.prototype.dataChanged = function (oldVal, newVal) { this.resize(); };
    WidgetList.prototype.resize = function () {
        this.style.height = (this.data.length * this.$.list.height) + 'px';
    };
    WidgetList.prototype.toBase = function (idx) {
        return WidgetList.codes.toCode(idx);
    };
    WidgetList.codes = new base.KeyboardBase();
    return WidgetList;
})(Polymer.DomModule);
WidgetList.prototype.is = 'widget-list';
WidgetList.prototype.properties = {
    data: {
        type: Array,
        value: [],
        observer: 'dataChanged'
    },
    selection: {
        type: Object,
        value: undefined
    }
};
