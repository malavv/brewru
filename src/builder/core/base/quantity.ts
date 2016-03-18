/// <reference path="../knowledge/domain/units.ts" />

class Quantity {
  private magnitude: number;
  private unit: Unit;

  public toString() : string {
    return this.magnitude + ' ' + this.unit.getSymbol();
  }
  
  constructor(magnitude: number, unit: Unit) {
    if (unit == null)
      console.warn('Quantity created with null unit');
    this.magnitude = magnitude;
    this.unit = unit;	
  }
}