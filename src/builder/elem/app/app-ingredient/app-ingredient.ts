/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/base/messageType.ts" />
/// <reference path="../../../src/base/quantity.ts" />
/// <reference path="../../../src/ingredients.ts" />

var Polymer:Function = Polymer || function () {}

class AppIngredient {
  $:any;
  
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
    bus.publish(MessageType.AnswerText, {
      ingredient: null,
      quantity: null
    });
  }
  
  initAndShow(data:Array<Ingredient>) {
    this.reset();
    this.$.quan.reset();
    this.ingredients = data;
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
}

Polymer(AppIngredient.prototype);