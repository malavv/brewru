/// <reference path="../../../src/base/polymer.d.ts" />
/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/base/messageType.ts" />
/// <reference path="../../../src/base/quantity.ts" />
/// <reference path="../../../src/ingredients.ts" />

class AppIngredient {
  $:any;
  
  ingredientSrc: IngredientSrc;
  ingredients: Array<Ingredient>;
  
  ingredient: Ingredient;
  quantity: Quantity;
  
  ready() {
    // Wizard for the selection of ingredient.
    bus.suscribe(MessageType.AskIngredient, this.initAndShow, this);
    // Cancel shuts down gracefully the wizard.
    bus.suscribe(MessageType.Cancel, this.cancel, this);
    
    this.reset();
  }
  
  cancel() {
    if (this.$.overlay.opened) this.$.overlay.close();
    bus.publish(MessageType.AnswerIngredient, {
      ingredient: null,
      quantity: null
    });
  }
  
  initAndShow() {
    this.reset();
    this.ingredients = this.ingredientSrc.stocks;
    this.$.quan.reset();
    this.$.overlay.open();
  }
  
  ingredientChanged() { 
    this.onStateChanged(); 
  }
  quantityChanged() {
    this.onStateChanged(); 
  }
  onStateChanged() {
    if (this.ingredient === undefined) return;
    if (this.quantity === undefined) return;
    bus.publish(MessageType.AnswerIngredient, {
      ingredient: this.ingredient,
      quantity: this.quantity
    });
    this.$.overlay.close();
  }
  
  reset() {
    this.ingredients = [];
    this.ingredient = undefined;
    this.quantity = undefined;
  }
  
  public static ask() : Promise<{ingredient: Ingredient; quantity: Quantity}> {
    return bus.publishAndWaitFor(MessageType.AnswerIngredient, MessageType.AskIngredient, null)
      .then(AppIngredient.isChoiceValid);
  }

  private static isChoiceValid(data: {ingredient: Ingredient; quantity: Quantity}) {
    return (data.ingredient !== null && data.quantity !== null)
      ? Promise.resolve(data) : Promise.reject('');
  }
}

if (!Polymer.getRegisteredPrototype('app-ingredient')) {
  Polymer('app-ingredient', AppIngredient.prototype);
}