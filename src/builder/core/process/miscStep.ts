/// <reference path="StepImpl.ts" />

enum MiscStepType {
  Decantation,
  Moderate_Aeration
}

class MiscStep extends StepImpl {
  private action: MiscStepType;

  constructor(name:string, action:MiscStepType, recipe:Recipe) {
    super(name, StepImplType.miscellaneous, recipe);
    this.action = action;
  }
}