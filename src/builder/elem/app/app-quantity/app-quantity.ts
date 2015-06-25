/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/base/quantity.ts" />

var Polymer:Function = Polymer || function () {}

class AppQuantity {
  $:any;
  
  description: string;
  quantity: Quantity;
  
  quantityChanged() {
    if (this.quantity === undefined) return;
    bus.publish(MessageType.AnswerIngredient, { qty: this.quantity });
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

Polymer(AppQuantity.prototype);