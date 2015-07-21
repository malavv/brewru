/// <reference path="../../../src/defs/polymer/polymer.ts" />
/// <reference path="../../../src/base/quantity.ts" />
/// <reference path="../../../src/units/system.ts" />
var WidgetUnits = (function () {
    function WidgetUnits() {
        this.is = 'widget-units';
        this.properties = {
            unit: {
                type: Unit,
                value: undefined
            },
            allowed: {
                type: Array,
                value: Dim.all()
            }
        };
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
    WidgetUnits.prototype.toTitle = function (input) {
        if (input === null || input === undefined)
            return 'n/a';
        return input.symbol;
    };
    WidgetUnits.prototype.onChoice = function (evt, idx, node) {
        this.properties.unit = UnitSystem.getUnit(node.dataset['unit']);
        this.isExpanded = false;
        this.ref = 0;
    };
    return WidgetUnits;
})();
