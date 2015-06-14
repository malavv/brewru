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
    bus.suscribe(MessageType.AskIngredient, this.onAskIngredient, this);
  }
  
  onAskIngredient(data:Array<Ingredient>) {
    this.ingredients = data;
    this.$.overlay.open();
  }
  
  ingredientChanged() { this.onStateChanged(); }
  quantityChanged() { this.onStateChanged(); }
  onStateChanged() {
    var results = this.getResults();
    if (!this.isValid(results)) return;
    bus.publish(MessageType.AnswerIngredient, results);
    this.$.overlay.close();
    this.reset();
  }

  isValid(result:{ingredient:Ingredient; quantity:Quantity}) {
    result = result || this;
    return result.ingredient !== undefined && result.quantity !== undefined;
  }
  getResults() : {ingredient:Ingredient; quantity:Quantity} {
    return {
      ingredient: this.ingredient,
      quantity: this.quantity
    };
  }
  sendResults() {
    bus.publish(MessageType.AnswerIngredient, this.getResults());
    this.reset();
  }
  reset() {
    this.ingredients = [];
    this.ingredient = undefined;
    this.quantity = undefined;
  }
}

Polymer(AppIngredient.prototype);