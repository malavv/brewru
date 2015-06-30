/// <reference path="../../src/step.ts" />
/// <reference path="../../src/base/conceptRef.ts" />
/// <reference path="../../src/errors.ts" />

/// <reference path="iStepFactory.ts" />
/// <reference path="addIngredientFactory.ts" />
/// <reference path="heatingFactory.ts" />

class StepFactory {
  public static create(ref: ConceptRef) : Promise<IStepFactory> {
    switch (ref.id) {
      case Step.Type.addIngredient.id: return Promise.resolve(new AddIngredientFactory());
      case Step.Type.heating.id: return Promise.resolve(new HeatingFactory());
      default:
        console.warn('StepFactory<create>');
        return Promise.reject(new UnimplementedError());
    }
  }
}