/// <reference path="StepImpl.ts" />

class IngredientStep extends StepImpl {
  public ingredient:Ingredient;
  public qty:Quantity;

  constructor(name:string, ingredient:Ingredient, qty:Quantity) {
    super(name, StepImplType.ingredient);
    this.ingredient = ingredient;
    this.qty = qty;
  }
}