/// <reference path="../../../src/base/polymer.d.ts" />
/// <reference path="../../../src/base/quantity.ts" />
/// <reference path="../../../src/units/system.ts" />

class WidgetUnits {
  USCust:Array<Unit>;
  SI:Array<Unit>;
  isExpanded:boolean;
  ref:number;
  unit:Unit;
  title:string;
  allowed: Array<Dim>;
  
  systems: Array<SystemImpl>;

  ready() {
    this.USCust = [];
    this.SI = [];
    this.title = 'n/a';
    this.unit = undefined;
    this.ref = 0;
    this.isExpanded = false;
    
    this.systems = UnitSystem.all();
    this.allowed = Dim.all();
  }
  
  listUnits(system:SystemImpl, dim: Dim) {
    return system.dim(dim);
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

  onChoice(evt: Event, idx: number, node: HTMLLIElement) {
    this.unit = UnitSystem.getUnit((<{[name:string]: string}>node.dataset)['unit']);
    
    this.isExpanded = false;
    this.ref = 0;
  }
}

if (!Polymer.getRegisteredPrototype('widget-units')) {
  Polymer('widget-units', WidgetUnits.prototype);
}