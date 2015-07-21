/// <reference path="../../../src/defs/polymer/polymer.ts" />
/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/base/quantity.ts" />
var AppQuantity = (function () {
    function AppQuantity() {
        this.is = 'app-quantity';
    }
    AppQuantity.prototype.quantityChanged = function () {
        if (this.quantity === undefined)
            return;
        bus.publish(MessageType.AnswerQuantity, { qty: this.quantity });
        this.$.overlay.close();
    };
    AppQuantity.prototype.ready = function () {
        bus.suscribe(MessageType.AskQuantity, this.focus, this);
        bus.suscribe(MessageType.Cancel, this.cancel, this);
        this.$.qty.restrictDimensions([Dim.Length]);
        this.reset();
    };
    AppQuantity.prototype.focus = function (config) {
        this.reset();
        this.$.qty.reset();
        this.description = config.description;
        this.$.qty.restrictDimensions(config.allowed);
        this.$.overlay.open();
    };
    AppQuantity.prototype.cancel = function () {
        if (this.$.overlay.opened)
            this.$.overlay.close();
        bus.publish(MessageType.AnswerQuantity, { qty: null });
    };
    AppQuantity.prototype.reset = function () {
        this.quantity = undefined;
    };
    return AppQuantity;
})();
