/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class WidgetQuantity extends Polymer.DomModule {
  /** Quantity to look for */
  public quantity : any;
  /** Dimensions you are allowed to choose from. */
  public allowed : PhysQty[];
  
  public amount: number;
  public unit: Unit;
  
  public restrictDimensions(dimensions: PhysQty[]) {
    console.log('restrict dimensions');
    this.allowed = dimensions;
  }
  
  public reset() {
    this.amount = 0;
    this.unit = null;
    this.quantity = null;
  }
  
  private _amountChanged() { this._check(); }
  private _unitChanged() { this._check(); }
  private _isValid() {
    return this.unit != null && this.amount !== 0;
  }
  private _check() {
    if (!this._isValid()) return;
    this.quantity = new Quantity(this.amount, this.unit);
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
      value: null
    },
    allowed: {
      type : Array,
      value: PhysQty.all()
    }
  }
}));