/// <reference path="dimension.ts" />
/// <reference path="unit.ts" />
/// <reference path="../base/conceptRef.ts" />

var
  SI: SystemImpl,
  UsCust: SystemImpl,
  Imperial: SystemImpl;

enum System {
  SI,
  UsCust,
  Imperial
}

SI = new SystemImpl([
  new Unit(new OntoRef('brew:kg', 'kilogram'), 'kg', 0, 1, Dim.Mass, System.SI),
  new Unit(new OntoRef('brew:liter', 'liter'), 'l', 0, 1, Dim.Volume, System.SI)
]);

UsCust = new SystemImpl([
    new Unit(new OntoRef('brew:inch', 'inch'), 'in', 0, 1, Dim.Length, System.UsCust)
]);

Imperial = new SystemImpl([]);

class SystemImpl {
  private units: Array<Unit> = [];

  constructor(units: Array<Unit>) {
    this.units = units;
    return this;
  }

  sym(symbol:string) : Unit {
    return this.units.filter(u => u.symbol === symbol)[0];
  }

  dim(dim: Dim) : Array<Unit> {
    return this.units.filter(u => u.dimension === dim);
  }
}