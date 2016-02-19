/// <reference path="StepImpl.ts" />

class CoolingStep extends GroupStep {
  constructor(name:string, recipe:Recipe, target: (TimeTarget|TempTarget)) {
    super(name, StepImplType.cooling, recipe, target);
  }
}