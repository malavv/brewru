/// <reference path="../knowledge/style.ts" />

class RecipeImpl {
  // Unique reference
  private id:string;

  // Recipe Metadata
  public name:string;
  public description:string;
  public style:Style;

  // Steps of the recipe
  private steps:StepImpl[];

  constructor() {
    this.id = 'unimplemented';
    this.steps = [];
  }

  addStep(step : StepImpl) {
    this.steps.push(step);
  }

  getGroupedByEquipment():StepImpl[][] {
    var processGroup:StepImpl[][] = [];
    var lastProcessIdx:number = 0;

    for (var i = 0; i < this.steps.length; i++) {
      if (this.steps[i].type == StepImplType.equipment && i !== lastProcessIdx) {
        processGroup.push(this.steps.slice(lastProcessIdx, i));
        lastProcessIdx = i;
      }
    }

    if (lastProcessIdx !== this.steps.length) {
      processGroup.push(this.steps.slice(lastProcessIdx, this.steps.length));
    }

    return processGroup;
  }
}