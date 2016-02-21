/// <reference path="../units/system.ts" />

enum StepImplType {
  equipment,
  ingredient,
  heating,
  cooling,
  fermenting,
  miscellaneous,
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

class ProcessStepTarget {
  private parent: ProcessStep;
  private recipe: Recipe;
  private ingredients: IngredientStep[] = [];
  private nameTmp;

  constructor(name:string, parent:ProcessStep, recipe:Recipe) {
    this.recipe = recipe;
    this.parent = parent;
    this.nameTmp = name;
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
    return this.nameTmp;
  }

  public toJSON() : Object {
    this.recipe = undefined;
    this.parent = undefined;
    return this;
  }
}

class ProcessStep extends StepImpl {
  public target:(TimeTarget|TempTarget);
  private begin: ProcessStepTarget;
  private end: ProcessStepTarget;
  private targets: ProcessStepTarget[];
  private isProcess: boolean = true;

  constructor(name:string,
              type:StepImplType = StepImplType.unknown,
              recipe:Recipe,
              target:(TimeTarget|TempTarget)) {
    super(name, type, recipe);
    this.target = target;
    this.begin = new ProcessStepTarget('begin ' + target.toString(), this, recipe);
    this.end = new ProcessStepTarget('end ' + target.toString(), this, recipe);
    this.targets = [];
  }
  public getTargets() : ProcessStepTarget[] {
    return [this.begin].concat(this.targets).concat([this.end]);
  }
  public onBegin() : ProcessStepTarget {
    return this.begin;
  }
  public onEnd() : ProcessStepTarget{
    return this.end;
  }
  public toEnd(target: (TimeTarget|TempTarget)) : ProcessStepTarget {
    var t = new ProcessStepTarget(target.toString() + " until target", this, this.recipe);
    this.targets.push(t);
    return t;
  }
}