/// <reference path="../step.ts" />
/// <reference path="wizard.ts" />

interface IStepFactory {
  data: { [key: string]: any; };

  next(): WizardConfig;

  build(): Step[];
  isComplete(): boolean;
}
