/// <reference path="../../../src/supply/ingredient.ts" />

enum WizardStep {
    text,
    menu,
    ingredient,
    quantity
}
interface IWizardScreen {
  (config:any) : Promise<any>;
}

class WizardConfig {
  propertyName:string;
  wizardPanel: WizardStep;
  config:any;

  constructor(propertyName:string, wizardPanel:WizardStep, config:any) {
    this.propertyName = propertyName;
    this.wizardPanel = wizardPanel;
    this.config = config;
  }
}

interface IStepFactory {
  data: { [key: string]: any; };

  next(): WizardConfig;

  build(): Step[];
  isComplete(): boolean;
}

class StepState {
  name: string;
  ingredient: Supply.Ing
  qty: Quantity;
  type: ConceptRef;
  
  constructor() {
    console.info("StepState[New Step Factory]");
  }
}