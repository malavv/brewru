/// <reference path="../../../src/base/polymer.d.ts" />
/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/base/messageType.ts" />
/// <reference path="../../../src/base/quantity.ts" />
/// <reference path="../../../src/ingredients.ts" />
/// <reference path="../../../src/errors.ts" />
/// <reference path="../../../src/recipe.ts" />

class AppIngredient {
  $:any;
  
  ingredientSrc: IngredientSrc;
  recipe: Recipe;
  
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
    bus.publish(MessageType.AnswerIngredient, { ingredient: null, quantity: null });
  }
  
  initAndShow(type: IngredientType) {
    this.reset();
    if (type === IngredientType.Dynamic) {
      this.ingredients = this.recipe.listDynamicIngredients();
    } else {
      this.ingredients = this.ingredientSrc.stocks.filter(i => i.type === type);
    }    
    this.$.quan.reset();
    this.$.overlay.open();
  }
  
  ingredientChanged() { this.onStateChanged(); }
  quantityChanged() { this.onStateChanged(); }
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