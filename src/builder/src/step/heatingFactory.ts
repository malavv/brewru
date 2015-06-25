/// <reference path="wizard.ts" />
/// <reference path="stepFactory.ts" />
/// <reference path="../step.ts" />

class HeatingFactory implements IStepFactory {
  info: Array<WizardConfig> = [
    new WizardConfig('name', WizardInfo.name, { description: 'Heating Step Name' }),
    new WizardConfig('qty', WizardInfo.quantity, { description: 'Heat the reactor to :', allowed: [ Dim.Temperature ]})
  ]
  
  data: { [key: string]: any; } = {};
  
  build(): Step {
    return new Step(this.data['name'], StepType.heating);
  }
  
  isComplete(): boolean {
    return this.data['name'] !== undefined && this.data['qty'] !== undefined;
  }
}