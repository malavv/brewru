/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />
var WidgetUnits = (function () {
    function WidgetUnits() {
    }
    WidgetUnits.prototype.ready = function () {
        this.USCust = [];
        this.SI = [];
        this.title = 'n/a';
        this.ref = 0;
        this.isExpanded = false;
        this.systems = UnitSystem.all();
    };
    WidgetUnits.prototype.listUnits = function (system, dim) {
        return system.dim(dim);
    };
    WidgetUnits.prototype.onHoverIn = function () {
        this.isExpanded = true;
        this.ref += 1;
    };
    WidgetUnits.prototype.onHoverOut = function () {
        var self = this;
        window.setTimeout(function () {
            self.ref = self.ref > 0 ? self.ref - 1 : 0;
            if (self.ref === 0)
                self.isExpanded = false;
        }, 100);
    };
    WidgetUnits.prototype.toTitle = function (unit) {
        return (unit === Unit.Unknown) ? 'n/a' : unit.symbol;
    };
    WidgetUnits.prototype.onChoice = function (evt, idx, node) {
        var trg = evt.target;
        var unitId = trg['dataUnit'];
        this.unit = UnitSystem.getUnit(unitId);
        this.isExpanded = false;
        this.ref = 0;
    };
    return WidgetUnits;
})();
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
            value: Dim.all()
        }
    },
    listeners: {
        mouseover: 'onHoverIn',
        mouseout: 'onHoverOut'
    }
}));
