/// <reference path="dimension.ts" />
/// <reference path="unit.ts" />
/// <reference path="../base/conceptRef.ts" />

class SystemImpl {
  private units: Array<Unit> = [];
  name: string;

  constructor(name:string, units: Array<Unit>) {
    this.name = name;
    this.units = units;
    this.units.forEach((u: Unit) => { u.system = this; });
    return this;
  }

  sym(symbol:string) : Unit {
    return this.units.filter(u => u.symbol === symbol)[0];
  }

  dim(dim: Dim) : Array<Unit> {
    return this.units.filter(u => u.dimension === dim);
  }
  
  getById(id: string) : Unit {
    var match: Unit[] = this.units.filter((u: Unit) => { return u.concept.ref === id; });
    return match.length === 0 ? null : match[0];
  }
}

class UnitSystem {
  public static SI = new SystemImpl('SI', [
    new Unit(new OntoRef('brew:kg', 'kilogram'), 'kg', 0, 1, Dim.Mass, null),
    new Unit(new OntoRef('brew:liter', 'liter'), 'l', 0, 1, Dim.Volume, null),
    new Unit(new OntoRef('brew:kelvin', 'kelvin'), 'K', 0, 1, Dim.Temperature, null),
    new Unit(new OntoRef('brew:celsius', 'celsius'), 'C', 0, 1, Dim.Temperature, null),
    new Unit(new OntoRef('brew:minute', 'minute'), 'min', 0, 1, Dim.Temporal, null)
  ]);
  public static UsCust = new SystemImpl('Us Cust.', [
      new Unit(new OntoRef('brew:inch', 'inch'), 'in', 0, 1, Dim.Length, null),
      new Unit(new OntoRef('brew:pint', 'pint'), 'pt', 0, 1, Dim.Volume, null),
      new Unit(new OntoRef('brew:cup', 'cup'), 'cup', 0, 1, Dim.Volume, null),
      new Unit(new OntoRef('brew:tsp', 'teaspoon'), 'tsp', 0, 1, Dim.Volume, null),
      new Unit(new OntoRef('brew:farenheit', 'farenheit'), 'F', 0, 1, Dim.Temperature, null)
  ]);
  public static Imperial = new SystemImpl('Imperial', [
  ]);
  
  public static all() : Array<SystemImpl> { return [this.SI, this.UsCust, this.Imperial]; }
  
  public static getUnit(id: string) : Unit {
    var match: Unit[] = this.all()
      .map((system:SystemImpl, idx: number, arr: SystemImpl[]) => {
        return system.getById(id)
      })
      .filter((unit: Unit) => {
        return unit !== null;
      });
    return match.length === 0 ? null : match[0];
  }
}

var
  SI: SystemImpl = UnitSystem.SI,
  UsCust: SystemImpl = UnitSystem.UsCust,
  Imperial: SystemImpl = UnitSystem.Imperial;