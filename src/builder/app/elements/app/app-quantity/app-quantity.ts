/// <reference path="../../../src/defs/polymer/polymer.ts" />
/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/base/quantity.ts" />

class AppQuantity {
  is:string = 'app-quantity';
  $:any;

  description: string;
  quantity: Quantity;

  quantityChanged() {
    if (this.quantity === undefined) return;
    bus.publish(MessageType.AnswerQuantity, { qty: this.quantity });
    this.$.overlay.close();
  }

  ready() {
    bus.suscribe(MessageType.AskQuantity, this.focus, this);
    bus.suscribe(MessageType.Cancel, this.cancel, this);
    this.$.qty.restrictDimensions([Dim.Length]);
    this.reset();
  }

  focus(config: {allowed: Dim[]; description: string}) : void {
    this.reset();
    this.$.qty.reset();
    this.description = config.description;
    this.$.qty.restrictDimensions(config.allowed);
    this.$.overlay.open();
  }

  cancel() : void {
    if (this.$.overlay.opened) this.$.overlay.close();
    bus.publish(MessageType.AnswerQuantity, { qty: null });
  }

  reset() {
    this.quantity = undefined;
  }
}