/// <reference path="../../../src/base/quantity.ts" />
/// <reference path="../../../src/units/system.ts" />

var Polymer:Function = Polymer || function () {}

class WidgetUnits {  
  USCust:Array<Unit>;
  SI:Array<Unit>;
  isExpanded:boolean = false;
  ref:number = 0;
  unit:Unit = undefined;
  title:string = 'Units';
  
  ready() {
    this.USCust = [];
    this.SI = [];
    Object.keys(UsCust.Mass).forEach(v => this.USCust.push(UsCust.Mass[v]));
    Object.keys(UsCust.Volume).forEach(v => this.USCust.push(UsCust.Volume[v]));
    Object.keys(UsCust.Length).forEach(v => this.USCust.push(UsCust.Length[v]));
    
    Object.keys(SI.Mass).forEach(v => this.SI.push(SI.Mass[v]));
    Object.keys(SI.Volume).forEach(v => this.SI.push(SI.Volume[v]));
    Object.keys(SI.Length).forEach(v => this.SI.push(SI.Length[v]));
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
  
  onChoice(a, b, c) {
    this.unit = this[c.dataset.system][c.dataset.unit];
    this.isExpanded = false;
    this.ref = 0;
  }
  
  unitChanged(oldValue, newValue) {
    if (newValue !== '') this.title = newValue;
    else this.title = 'Units';
  }
}

Polymer(WidgetUnits.prototype);