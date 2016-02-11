/// <reference path="StepImpl.ts" />

class HeatingStep extends GroupStep {
  constructor(name:string, next?:number) {
    super(name, StepImplType.heating, next);
  }

  public static create(name:string):HeatingStep[] {
    var
        h2 = new HeatingStep("End (" + name + ")"),
        h1 = new HeatingStep("Begin (" + name + ")", h2.id);
    return [h1, h2];
  }
}