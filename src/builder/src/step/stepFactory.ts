/// <reference path="../../src/step.ts" />
/// <reference path="../../src/base/conceptRef.ts" />

/// <reference path="iStepFactory.ts" />
/// <reference path="addIngredientFactory.ts" />
/// <reference path="heatingFactory.ts" />

class StepFactory {
  public static create(ref: ConceptRef) : IStepFactory {
    switch (ref.id) {
      case Step.Type.addIngredient.id: return new AddIngredientFactory();
      case Step.Type.heating.id: return new HeatingFactory();
      default:
        console.warn('StepFactory<create>');
        return null;
    }
  }
}