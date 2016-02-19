/// <reference path="StepImpl.ts" />

class FermentationStepTarget {
  private parent: FermentationStep;
  private recipe: Recipe;
  private ingredients: IngredientStep[] = [];

  constructor(parent:FermentationStep, recipe:Recipe) {
    this.recipe = recipe;
    this.parent = parent;
  }

  public addIng(name: string, ingredient: Supply.Ing, quantity: Quantity) : FermentationStepTarget {
    this.ingredients.push(new IngredientStep(name, ingredient, quantity, this.recipe));
    return this;
  }

  public onBegin() : FermentationStepTarget { return this.parent.onBegin(); }
  public toEnd(target: (TimeTarget|TempTarget)) : FermentationStepTarget { return this.parent.toEnd(target); }
  public onEnd() : FermentationStepTarget { return this.parent.onEnd(); }

  public toJSON() : Object {
    this.recipe = undefined;
    this.parent = undefined;
    return this;
  }
}

class FermentationStep extends GroupStep {
  private begin: FermentationStepTarget;
  private end: FermentationStepTarget;
  private targets: FermentationStepTarget[];

  constructor(name:string, recipe:Recipe, target: (TimeTarget|TempTarget)) {
    super(name, StepImplType.fermenting, recipe, target);
    this.begin = new FermentationStepTarget(this, recipe);
    this.end = new FermentationStepTarget(this, recipe);
    this.targets = [];
  }

  public onBegin() : FermentationStepTarget {
    return this.begin;
  }
  public onEnd() : FermentationStepTarget{
    return this.end;
  }
  public toEnd(target: (TimeTarget|TempTarget)) : FermentationStepTarget {
    var t = new FermentationStepTarget(this, this.recipe);
    this.targets.push(t);
    return t;
  }
}