/// <reference path="../../../src/defs/polymer/polymer.ts" />
/// <reference path="../../../src/base/keyboard.ts" />
var WidgetText = (function () {
    function WidgetText() {
        this.is = 'widget-text';
    }
    // Events
    WidgetText.prototype.onClick = function () {
        var _this = this;
        this.selected = 0;
        window.setTimeout(function () {
            _this.$.editor.focus();
            _this.$.editor.select();
        });
    };
    WidgetText.prototype.onBlur = function () {
        this.cancel();
    };
    WidgetText.prototype.onFocus = function () {
        this.commited = this.value;
    };
    WidgetText.prototype.onKeyup = function (evt) {
        switch (Keyboard.fromEvt(evt).binding) {
            case 'enter':
                this.commit();
                break;
            case 'esc':
                this.cancel();
                break;
        }
    };
    // Methods
    WidgetText.prototype.cancel = function () {
        this.selected = 1;
        this.value = this.commited;
    };
    WidgetText.prototype.commit = function () {
        this.commited = this.value;
        this.selected = 1;
    };
    return WidgetText;
})();
WidgetText.prototype.is = 'widget-text';
WidgetText.prototype.listeners = {
    'keyup': 'onKeyup',
    'click': 'onClick'
};
WidgetText.prototype.properties = {
    value: {
        type: String
    },
    commited: {
        type: String,
        value: ''
    },
    selected: {
        type: Number,
        value: 1
    }
};
