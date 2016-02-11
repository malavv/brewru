/// <reference path="dimension.ts" />
/// <reference path="unit.ts" />
/// <reference path="../base/conceptRef.ts" />

class SystemImpl {
  private units: Array<Unit> = [];
  private id: string;
  name: string;

  constructor(id:string, name:string, units: Array<Unit>) {
    this.id = id;
    this.name = name;
    this.units = units;
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
  public static SI = new SystemImpl('brew:SI', 'SI', [
    new Unit(new OntoRef('brew:kg', 'kilogram'), 'kg', 0, 1, Dim.Mass, 'brew:SI'),
    new Unit(new OntoRef('brew:g', 'gram'), 'g', 0, 1, Dim.Mass, 'brew:SI'),
    new Unit(new OntoRef('brew:liter', 'liter'), 'l', 0, 1, Dim.Volume, 'brew:SI'),
    new Unit(new OntoRef('brew:kelvin', 'kelvin'), 'K', 0, 1, Dim.Temperature, 'brew:SI'),
    new Unit(new OntoRef('brew:celsius', 'celsius'), 'C', 0, 1, Dim.Temperature, 'brew:SI'),
    new Unit(new OntoRef('brew:minute', 'minute'), 'min', 0, 1, Dim.Temporal, 'brew:SI'),
    new Unit(new OntoRef('brew:unit', 'unit'), 'u', 0, 1, Dim.Unit, 'brew:SI')
  ]);
  public static UsCust = new SystemImpl('brew:UsCust', 'Us Cust.', [
      new Unit(new OntoRef('brew:inch', 'inch'), 'in', 0, 1, Dim.Length, 'brew:UsCust'),
      new Unit(new OntoRef('brew:pint', 'pint'), 'pt', 0, 1, Dim.Volume, 'brew:UsCust'),
      new Unit(new OntoRef('brew:cup', 'cup'), 'cup', 0, 1, Dim.Volume, 'brew:UsCust'),
      new Unit(new OntoRef('brew:tsp', 'teaspoon'), 'tsp', 0, 1, Dim.Volume, 'brew:UsCust'),
      new Unit(new OntoRef('brew:farenheit', 'farenheit'), 'F', 0, 1, Dim.Temperature, 'brew:UsCust')
  ]);
  public static Imperial = new SystemImpl('brew:Imperial', 'Imperial', [
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