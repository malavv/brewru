/// <reference path="../units/Units.ts" />

class Quantity {
  private magnitude: number;
  private unit: TUnit;

  public toString() : string {
    return this.magnitude + ' ' + this.unit.getSymbol();
  }
  
  constructor(magnitude: number, unit: TUnit) {
    if (unit == null)
      console.warn('Quantity created with null unit');
    this.magnitude = magnitude;
    this.unit = unit;	
  }
}