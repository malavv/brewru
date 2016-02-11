/// <reference path="StepImpl.ts" />

class CoolingStep extends GroupStep {
  constructor(name:string, next?:number) {
    super(name, StepImplType.cooling, next);
  }

  public static create(name:string):CoolingStep[] {
    var
        c2 = new CoolingStep("End (" + name + ")"),
        c1 = new CoolingStep("Begin (" + name + ")", c2.id);
    return [c1, c2];
  }
}