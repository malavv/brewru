/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var WidgetQuantity = (function (_super) {
    __extends(WidgetQuantity, _super);
    function WidgetQuantity() {
        _super.apply(this, arguments);
    }
    WidgetQuantity.prototype.restrictDimensions = function (dimensions) {
        console.log('restrict dimensions');
        this.allowed = dimensions;
    };
    WidgetQuantity.prototype.reset = function () {
        this.amount = 0;
        this.unit = Unit.Unknown;
        this.quantity = undefined;
    };
    WidgetQuantity.prototype._amountChanged = function () { this._check(); };
    WidgetQuantity.prototype._unitChanged = function () { this._check(); };
    WidgetQuantity.prototype._isValid = function () {
        return this.unit !== Unit.Unknown && this.amount !== 0;
    };
    WidgetQuantity.prototype._check = function () {
        if (!this._isValid())
            return;
        this.quantity = new Quantity(this.amount, this.unit);
    };
    return WidgetQuantity;
})(Polymer.DomModule);
window.Polymer(window.Polymer.Base.extend(WidgetQuantity.prototype, {
    is: 'widget-quantity',
    properties: {
        amount: {
            type: Number,
            observer: '_amountChanged',
            value: 0
        },
        quantity: {
            type: Quantity,
            notify: true
        },
        unit: {
            type: Unit,
            observer: '_unitChanged',
            value: Unit.Unknown
        },
        allowed: {
            type: Array,
            value: Dim.all()
        }
    }
}));
