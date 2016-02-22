/// <reference path="../units/system.ts" />

enum StepImplType {
  equipment,
  ingredient,
  heating,
  cooling,
  fermenting,
  miscellaneous,
  processTarget,
  unknown
}
class TempTarget {
  private magnitude: number;
  private unit: Unit;

  public static BOIL: TempTarget = new TempTarget(100, SI.sym("C"));

  public constructor(magnitude: number, unit: Unit) {
    this.magnitude = magnitude;
    this.unit = unit;
  }

  public toString() : string {
    return this.magnitude + " " + this.unit.symbol;
  }
}
class TimeTarget {
  private magnitude: number;
  private unit: Unit;

  public constructor(magnitude: number, unit: Unit) {
    this.magnitude = magnitude;
    this.unit = unit;
  }

  public toString() : string {
    return this.magnitude + " " + this.unit.symbol;
  }
}

class StepImpl {
  private static uid:number = 0;

  protected recipe: Recipe;
  public id:number;
  public name:string;
  public type:StepImplType;

  constructor(name:string, type:StepImplType = StepImplType.unknown, recipe:Recipe) {
    this.name = name;
    this.type = type;
    this.recipe = recipe;
    this.id = StepImpl.uid++;
  }

  public toJSON() : Object {
    this.recipe = undefined;
    return this;
  }
}

class ProcessStepTarget extends StepImpl {
  private parent: ProcessStep;
  private ingredients: IngredientStep[] = [];

  constructor(name:string, parent:ProcessStep, recipe:Recipe) {
    super(name, StepImplType.processTarget, recipe);
    this.parent = parent;
  }

  public addIng(name: string, ingredient: Supply.Ing, quantity: Quantity) : ProcessStepTarget {
    this.ingredients.push(new IngredientStep(name, ingredient, quantity, this.recipe));
    return this;
  }

  public onBegin() : ProcessStepTarget { return this.parent.onBegin(); }
  public toEnd(target: (TimeTarget|TempTarget)) : ProcessStepTarget { return this.parent.toEnd(target); }
  public onEnd() : ProcessStepTarget { return this.parent.onEnd(); }

  public getIng() : IngredientStep[] {
    return this.ingredients;
  }

  public toString() : string {
    return this.name;
  }

  public toJSON() : Object {
    this.recipe = undefined;
    this.parent = undefined;
    return this;
  }
}

class ProcessStep extends StepImpl {
  public target:(TimeTarget|TempTarget);
  private targets: ProcessStepTarget[];
  private isProcess: boolean = true;

  constructor(name:string,
              type:StepImplType = StepImplType.unknown,
              recipe:Recipe,
              target:(TimeTarget|TempTarget)) {
    super(name, type, recipe);
    this.target = target;
    this.targets = [
      new ProcessStepTarget('begin ' + target.toString(), this, recipe),
      new ProcessStepTarget('end ' + target.toString(), this, recipe)
    ];
  }
  public getTargets() : ProcessStepTarget[] {
    return this.targets;
  }
  public onBegin() : ProcessStepTarget {
    return this.targets[0];
  }
  public onEnd() : ProcessStepTarget{
    return this.targets[this.targets.length - 1];
  }
  public toEnd(target: (TimeTarget|TempTarget)) : ProcessStepTarget {
    var t = new ProcessStepTarget(target.toString() + " until target", this, this.recipe);
    this.targets.splice(this.targets.length - 1, 0, t);
    return t;
  }
}