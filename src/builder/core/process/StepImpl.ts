/// <reference path="../knowledge/domain/units.ts" />
/// <reference path="../knowledge/domain/substance.ts"/>
/// <reference path="../base/quantity.ts" />
/// <reference path="../base/encodable.ts"/>

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
class TempTarget implements Encodable {
  private quantity: Quantity;

  public static getBoil() : TempTarget {
      return new TempTarget(100, SU("°C"));
  }

  public constructor(magnitude: number, unit: Unit) {
    this.quantity = new Quantity(magnitude, unit);
  }

  public toString() : string {
    return 'Temp target at ' + this.quantity.toString();
  }

  public encode() {
    return {
      type: 'TempTarget',
      quantity : this.quantity.encode()
    }
  }
}
class TimeTarget implements Encodable {
  private quantity: Quantity;

  public constructor(magnitude: number, unit: Unit) {
    this.quantity = new Quantity(magnitude, unit);
  }

  public toString() : string {
    return 'Time target at ' + this.quantity.toString();
  }

  public encode() {
    return {
      type: 'TimeTarget',
      quantity : this.quantity.encode()
    }
  }
}

abstract class StepImpl implements Encodable {
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
  encode() : Object {
    return this.toJSON();
  }
}

class ProcessStepTarget extends StepImpl implements Encodable{
  private parent: ProcessStep;
  private ingredients: IngredientStep[] = [];

  constructor(name:string, parent:ProcessStep, recipe:Recipe) {
    super(name, StepImplType.processTarget, recipe);
    this.parent = parent;
  }

  public addIng(name: string, ingredient: Substance, quantity: Quantity) : ProcessStepTarget {
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
  public encode():Object {
    return {
      type: this.type,
      tmpName: this.name,
      ingredients: this.ingredients.map(e => e.encode())
    };
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

  public encode() : Object {
    return {
      target: this.target.encode,
      targets: (<Encodable[]>this.targets).map(t => t.encode())
    }
  }
}
