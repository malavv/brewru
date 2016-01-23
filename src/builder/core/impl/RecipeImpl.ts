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
}