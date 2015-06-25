/// <reference path="wizard.ts" />
/// <reference path="stepFactory.ts" />
/// <reference path="../step.ts" />

class AddIngredientFactory implements IStepFactory {
  info: Array<WizardConfig> = [
    new WizardConfig('name', WizardInfo.name, { description: 'Ingredient Step Name' }),
    new WizardConfig('qty', WizardInfo.ingredient, {})
  ]
  
  data: { [key: string]: any; } = {};
  
  build(): Step {
    return new Step(this.data['name'], StepType.addIngredient);
  }
  
  isComplete(): boolean {
    return this.data['name'] !== undefined && this.data['qty'] !== undefined;
  }
}