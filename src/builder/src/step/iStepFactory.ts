/// <reference path="../step.ts" />

interface IWizardScreen {
  (config:any) : Promise<any>;
}

class WizardConfig {
  propertyName:string;
  wizardScreen:IWizardScreen;
  config:any;

  constructor(propertyName:string, wizardScreen:IWizardScreen, config:any) {
    this.propertyName = propertyName;
    this.wizardScreen = wizardScreen;
    this.config = config;
  }
}

interface IStepFactory {
  data: { [key: string]: any; };

  next(): WizardConfig;

  build(): Step[];
  isComplete(): boolean;
}
