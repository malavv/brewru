/// <reference path="../../../src/base/polymer.d.ts" />
/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/base/quantity.ts" />

class AppQuantity {
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

  public static ask(config:{ description: String; allowed: Array<Dim> }) : Promise<Quantity> {
    return bus.publishAndWaitFor(MessageType.AnswerQuantity, MessageType.AskQuantity, config)
      .then(AppQuantity.isChoiceValid);
  }

  private static isChoiceValid(data: { qty: Quantity }) {
    return data.qty !== undefined ? Promise.resolve(data.qty) : Promise.reject('');
  }
}

if (!Polymer.getRegisteredPrototype('app-quantity')) {
  Polymer('app-quantity', AppQuantity.prototype);
}