/// <reference path="../../../lib/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WidgetText = (function (_super) {
    __extends(WidgetText, _super);
    function WidgetText() {
        _super.apply(this, arguments);
    }
    WidgetText.prototype._clickHandler = function () {
        var _this = this;
        this._setEditing(true);
        this.async(function () {
            _this.$.editor.focus();
            _this.$.editor.select();
        }, 1);
    };
    WidgetText.prototype._setEditing = function (isEditing) {
        this.selected = isEditing ? 0 : 1;
    };
    WidgetText.prototype._valueHandler = function () {
        this._setEditing(false);
    };
    return WidgetText;
})(Polymer.DomModule);
window.Polymer(window.Polymer.Base.extend(WidgetText.prototype, {
    is: 'widget-text',
    properties: {
        selected: {
            type: Number,
            value: 1
        },
        value: {
            type: String,
            observer: '_valueHandler',
            notify: true
        }
    },
    listeners: {
        'click': '_clickHandler'
    }
}));
