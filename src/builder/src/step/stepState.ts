/// <reference path="../base/quantity.ts" />
/// <reference path="../base/conceptRef.ts" />
/// <reference path="../ingredient.ts" />

class StepState {
  name: string;
  ingredient: Ingredient
  qty: Quantity;
  type: ConceptRef;
  
  constructor() {
    console.info("StepState[New Step Factory]");
  }
}