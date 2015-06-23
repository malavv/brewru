/// <reference path="../../src/step.ts" />
/// <reference path="../../src/base/conceptRef.ts" />

interface IStepFactory {
  info: Array<WizardConfig>;
  data: { [key: string]: any; };
  
  build(): Step;
  isComplete(): boolean;
}

class AddIngredient implements IStepFactory {
  info: Array<WizardConfig> = [
    new WizardConfig('name', WizardInfo.name),
    new WizardConfig('ingredientQuantity', WizardInfo.ingredient)
  ]
  
  data: { [key: string]: any; } = {};
  
  build(): Step {
    return new Step(this.data['name'], StepType.addIngredient);
  }
  
  isComplete(): boolean {
    return this.data['name'] !== undefined && this.data['ingredientQuantity'] !== undefined;
  }
}


class StepFactory {
  public static create(ref: ConceptRef) : IStepFactory {
    switch (ref.id) {
      case Step.Type.addIngredient.id:
        return new AddIngredient();
      default:
        console.warn('StepFactory<create>');
        return null;
    }
  }
}