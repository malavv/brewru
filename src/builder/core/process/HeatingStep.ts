/// <reference path="StepImpl.ts" />

class HeatingStepTarget {
  private parent: HeatingStep;
  private recipe: Recipe;
  private ingredients: IngredientStep[] = [];

  constructor(parent:HeatingStep, recipe:Recipe) {
    this.recipe = recipe;
    this.parent = parent;
  }

  public addIng(name: string, ingredient: Supply.Ing, quantity: Quantity) : HeatingStepTarget {
    this.ingredients.push(new IngredientStep(name, ingredient, quantity, this.recipe));
    return this;
  }

  public onBegin() : HeatingStepTarget { return this.parent.onBegin(); }
  public toEnd(target: (TimeTarget|TempTarget)) : HeatingStepTarget { return this.parent.toEnd(target); }
  public onEnd() : HeatingStepTarget { return this.parent.onEnd(); }

  public toJSON() : Object {
    this.recipe = undefined;
    this.parent = undefined;
    return this;
  }
}

class HeatingStep extends GroupStep {
  private begin: HeatingStepTarget;
  private end: HeatingStepTarget;
  private targets: HeatingStepTarget[];

  constructor(name:string, recipe:Recipe, target:(TimeTarget|TempTarget)) {
    super(name, StepImplType.heating, recipe, target);
    this.begin = new HeatingStepTarget(this, recipe);
    this.end = new HeatingStepTarget(this, recipe);
    this.targets = [];
  }

  public onBegin() : HeatingStepTarget {
    return this.begin;
  }
  public onEnd() : HeatingStepTarget{
    return this.end;
  }
  public toEnd(target: (TimeTarget|TempTarget)) : HeatingStepTarget {
    var t = new HeatingStepTarget(this, this.recipe);
    this.targets.push(t);
    return t;
  }
}