/// <reference path="../../../src/base/quantity.ts" />
/// <reference path="../../../src/units/system.ts" />

var Polymer:Function = Polymer || function () {}

class WidgetUnits {
  USCust:Array<Unit>;
  SI:Array<Unit>;
  isExpanded:boolean;
  ref:number;
  unit:Unit;
  title:string;

  ready() {
    this.USCust = [];
    this.SI = [];
    this.title = 'n/a';
    this.unit = undefined;
    this.ref = 0;
    this.isExpanded = false;

    UsCust.dim(Dim.Mass).forEach(u => this.USCust.push(u));
    UsCust.dim(Dim.Volume).forEach(u => this.USCust.push(u));
    UsCust.dim(Dim.Length).forEach(u => this.USCust.push(u));

    SI.dim(Dim.Mass).forEach(u => this.SI.push(u));
    SI.dim(Dim.Volume).forEach(u => this.SI.push(u));
    SI.dim(Dim.Length).forEach(u => this.SI.push(u));
  }

  onHoverIn() {
    this.isExpanded = true;
    this.ref += 1;
  }

  onHoverOut() {
    var self = this;
    window.setTimeout(function() {
      self.ref = self.ref > 0 ? self.ref - 1 : 0;
      if (self.ref === 0)
        self.isExpanded = false;
    }, 100)
  }
  
  toTitle(input?:Unit) : string {
    if (input === null || input === undefined) return 'n/a';
    return input.symbol;    
  }

  onChoice(a:any, b:any, c:any) {
    this.unit = this.getUnit(c.dataset.system, c.dataset.unit);
    this.isExpanded = false;
    this.ref = 0;
  }

  getUnit(system:string, unit:number) : Unit {
    console.log('getUnit', system, unit);
    switch(system) {
      case 'USCust':
        return this.USCust[unit];
      case 'SI':
        return this.SI[unit];
    }
  }

  unitChanged(oldValue:Unit, newValue:Unit) {
    console.log('[WidgetUnits]unitChanged');
    //if (newValue !== undefined)
      //this.title = newValue.concept.name;
    //else 
      //this.title = 'Units';
  }
}

Polymer(WidgetUnits.prototype);