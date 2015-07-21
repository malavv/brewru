/// <reference path="../../../src/defs/polymer/polymer.ts" />
/// <reference path="../../../src/base/quantity.ts" />
/// <reference path="../../../src/units/unit.ts" />
var WidgetQuantity = (function () {
    function WidgetQuantity() {
        this.is = 'widget-quantity';
        this.val = 0;
        this.commited = 0;
        this.unit = undefined;
        this.allowed = [];
        this.properties = {
            quantity: {
                type: Quantity,
                value: undefined
            }
        };
    }
    WidgetQuantity.prototype.commitedChanged = function (oldVal, newVal) { this.check(); };
    WidgetQuantity.prototype.unitChanged = function (oldVal, newVal) { this.check(); };
    WidgetQuantity.prototype.isValid = function () {
        return this.unit !== undefined && this.commited !== 0 && this.unit !== Unit.Unknown;
    };
    WidgetQuantity.prototype.check = function () {
        if (!this.isValid())
            return;
        this.properties.quantity = new Quantity(this.commited, this.unit);
    };
    WidgetQuantity.prototype.restrictDimensions = function (dimensions) {
        this.allowed = dimensions;
    };
    WidgetQuantity.prototype.reset = function () {
        this.val = 0;
        this.commited = 0;
        this.unit = undefined;
        this.properties.quantity = undefined;
    };
    return WidgetQuantity;
})();
