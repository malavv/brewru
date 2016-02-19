/// <reference path="StepImpl.ts" />

class FermentationStep extends ProcessStep {
  constructor(name:string, type:StepImplType, recipe:Recipe, target:TimeTarget|TempTarget) {
    super(name, type, recipe, target);
  }
}