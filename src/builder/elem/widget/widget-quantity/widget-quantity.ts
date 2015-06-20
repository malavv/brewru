/// <reference path="../../../src/base/quantity.ts" />
/// <reference path="../../../src/units/unit.ts" />

var Polymer:Function = Polymer || function () {}

class WidgetQuantity {
  val:number = 0;
  commited:number = 0;
  unit:Unit = undefined;
  quantity:Quantity = undefined;
  
  commitedChanged(oldVal:number, newVal:number) { this.check(); }
  unitChanged(oldVal:Unit, newVal:Unit) { this.check(); }
  isValid() {
    return this.unit !== undefined && this.commited !== 0 && this.unit !== Unit.Unknown;
  }
  check() {
    if (!this.isValid()) return;
    this.quantity = new Quantity(this.commited, this.unit);
  }
  
  public reset() {
    this.val = 0;
    this.commited = 0;
    this.unit = undefined;
    this.quantity = undefined;
  }
}

Polymer(WidgetQuantity.prototype);