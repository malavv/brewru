/// <reference path="StepImpl.ts" />

class IngredientStep extends StepImpl {
  public ingredient:Supply.Ing;
  public qty:Quantity;

  constructor(name:string, ingredient:Supply.Ing, qty:Quantity) {
    super(name, StepImplType.ingredient);
    this.ingredient = ingredient;
    this.qty = qty;
  }
}