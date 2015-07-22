/// <reference path="../../../src/defs/polymer/polymer.ts" />

/// <reference path="../../../src/base/quantity.ts" />
/// <reference path="../../../src/units/unit.ts" />

class WidgetQuantity extends Polymer.DomModule {
  amount: number;
  unit: Unit;
  
  quantity:any;
  allowed: Array<Dim>;
  
  private _amountChanged() { this._check(); }
  private _unitChanged() { this._check(); }
  
  private _isValid() {
    return this.unit !== Unit.Unknown && this.amount !== 0;
  }
  
  private _check() {
    if (!this._isValid()) return;
    this.quantity = new Quantity(this.amount, this.unit);
  }
  
  public restrictDimensions(dimensions: Array<Dim>) {
    console.log('restrict dimensions');
    this.allowed = dimensions;
  }
  
  public reset() {
    this.amount = 0;
    this.unit = Unit.Unknown;
    this.quantity = undefined;
  }
}

window.Polymer(window.Polymer.Base.extend(WidgetQuantity.prototype, {
  is: 'widget-quantity',

  properties: {
    amount: {
      type:Number,
      observer: '_amountChanged',
      value: 0
    },
    quantity: {
      type:Quantity,
      notify: true
    },
    unit: {
      type:Unit,
      observer: '_unitChanged',
      value: Unit.Unknown
    },
    allowed: {
      type:Array,
      value: Dim.all()
    }
  },

  listeners: {
  }
}));