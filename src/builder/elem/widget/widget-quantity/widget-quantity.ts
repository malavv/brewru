/// <reference path="../../../src/base/polymer.d.ts" />
/// <reference path="../../../src/base/quantity.ts" />
/// <reference path="../../../src/units/unit.ts" />

class WidgetQuantity {
  is:string = 'widget-quantity';
  val:number = 0;
  commited:number = 0;
  unit:Unit = undefined;
  allowed: Array<Dim> = [];
  
  properties:any = {
    quantity: {
      type: Quantity,
      value: undefined
    }
  }
  
  commitedChanged(oldVal:number, newVal:number) { this.check(); }
  unitChanged(oldVal:Unit, newVal:Unit) { this.check(); }
  
  isValid() {
    return this.unit !== undefined && this.commited !== 0 && this.unit !== Unit.Unknown;
  }
  
  check() {
    if (!this.isValid()) return;
    this.properties.quantity = new Quantity(this.commited, this.unit);
  }
  
  public restrictDimensions(dimensions: Array<Dim>) {
    this.allowed = dimensions;
  }
  
  public reset() {
    this.val = 0;
    this.commited = 0;
    this.unit = undefined;
    this.properties.quantity = undefined;
  }
}