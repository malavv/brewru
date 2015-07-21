/// <reference path="../../../src/defs/polymer/polymer.ts" />

/// <reference path="../../../src/base/quantity.ts" />
/// <reference path="../../../src/units/system.ts" />

class WidgetUnits {
  is:string = 'widget-units';
  USCust:Array<Unit>;
  SI:Array<Unit>;
  isExpanded:boolean;
  ref:number;
  title:string;
  
  systems: Array<SystemImpl>;
  
  properties:any = {
    unit: {
      type: Unit,
      value: undefined
    },
    allowed: {
      type: Array,
      value: Dim.all()
    }
  }

  ready() {
    this.USCust = [];
    this.SI = [];
    this.title = 'n/a';
    this.ref = 0;
    this.isExpanded = false;
    
    this.systems = UnitSystem.all();
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
    this.properties.unit = UnitSystem.getUnit((<{[name:string]: string}>node.dataset)['unit']);
    
    this.isExpanded = false;
    this.ref = 0;
  }
}