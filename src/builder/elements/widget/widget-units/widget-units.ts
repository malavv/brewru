/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class WidgetUnits {
  USCust:Array<Unit>;
  SI:Array<Unit>;
  isExpanded:boolean;
  ref:number;
  title:string;
  unit: Unit;
  
  systems: Array<SystemImpl>;

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
  
  toTitle(unit:Unit) : string {
    return (unit === Unit.Unknown) ? 'n/a' : unit.symbol;
  }

  onChoice(evt: MouseEvent, idx: number, node: HTMLLIElement) {
    var trg : {[name:string]: string} = <any>evt.target; 
    var unitId: string = trg['dataUnit'];
    this.unit = UnitSystem.getUnit(unitId);
    this.isExpanded = false;
    this.ref = 0;
  }
}

window.Polymer(window.Polymer.Base.extend(WidgetUnits.prototype, {
  is: 'widget-units',

  properties: {
    unit: {
      type: Unit,
      value: Unit.Unknown,
      notify: true
    },
    allowed: {
      type: Array,
      value: allDimensions()
    }
  },

  listeners: {
    mouseover: 'onHoverIn',
    mouseout: 'onHoverOut'
  }
}));