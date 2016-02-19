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

enum ProcessStepGoal {
  TEMPERATURE,
  TIME
}

class TempTarget {
  private magnitude: number;
  private unit: Unit;

  public static BOIL: TempTarget = new TempTarget(100, SI.sym("C"));

  public constructor(magnitude: number, unit: Unit) {
    this.magnitude = magnitude;
    this.unit = unit;
  }
}
class TimeTarget {
  private magnitude: number;
  private unit: Unit;

  public constructor(magnitude: number, unit: Unit) {
    this.magnitude = magnitude;
    this.unit = unit;
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



class GroupStep extends StepImpl {
  public target: (TimeTarget|TempTarget);

  constructor(name:string,
              type:StepImplType = StepImplType.unknown,
              recipe:Recipe,
              target:(TimeTarget|TempTarget)) {
    super(name, type, recipe);
    this.target = target;
  }
}