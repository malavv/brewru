/// <reference path="../../../src/base/quantity.ts" />
/// <reference path="../../../src/units/unit.ts" />

var Polymer:Function = Polymer || function () {}

class WidgetQuantity {
  val= 0;
  commited= 0;
  unit= undefined;
  quantity= undefined;
  
  ready() {}
  
  commitedChanged(oldVal, newVal) { this.check(); }
  unitChanged(oldVal, newVal) { this.check(); }
  isValid() {
    return this.unit !== undefined && this.commited !== 0 && this.unit !== Unit.Unknown;
  }
  check() {
    if (!this.isValid()) return;
    this.quantity = new Quantity(this.commited, this.unit);
  }
}

Polymer(WidgetQuantity.prototype);