/// <reference path="../step.ts" />
/// <reference path="wizard.ts" />

interface IStepFactory {
  info: Array<WizardConfig>;
  data: { [key: string]: any; };
  
  build(): Step;
  isComplete(): boolean;
}