/// <reference path="StepImpl.ts" />

class IngredientStep extends StepImpl {
  public ingredient:Supply.Ing;
  public qty:Quantity;

  constructor(name:string, ingredient:Supply.Ing, qty:Quantity, recipe:Recipe) {
    super(name, StepImplType.ingredient, recipe);
    this.ingredient = ingredient;
    this.qty = qty;
  }

  public encode() : Object {
    return {
      ingredient: this.ingredient != null ? this.ingredient.getRef() : null,
      qty: this.qty != null ? this.qty.encode(): null
    }
  }
}