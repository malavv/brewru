/// <reference path="StepImpl.ts" />

class FermentationStep extends GroupStep {
  constructor(name:string, next?:number) {
    super(name, StepImplType.fermenting, next);
  }

  public static create(name:string):FermentationStep[] {
    var
        f2 = new FermentationStep("End (" + name + ")"),
        f1 = new FermentationStep("Begin (" + name + ")", f2.id);
    return [f1, f2];
  }
}