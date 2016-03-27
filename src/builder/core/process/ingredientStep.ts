/// <reference path="StepImpl.ts" />
/// <reference path="../knowledge/domain/substance.ts"/>

class IngredientStep extends StepImpl {
  public ing : Substance;
  public qty : Quantity;

  constructor(name : string, ingredient : Substance, qty : Quantity, recipe : Recipe) {
    super(name, StepImplType.ingredient, recipe);
    this.ing = ingredient;
    this.qty = qty;
  }

  public encode() : Object {
    return {
      ing: this.ing.iri,
      qty: this.qty.encode()
    }
  }
}
