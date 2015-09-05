/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var WidgetList = (function (_super) {
    __extends(WidgetList, _super);
    function WidgetList() {
        _super.apply(this, arguments);
    }
    /**
     * Allows external code to clear the selection.
     *
     * Watch out for the need to async this. Depending on when you notice the selection.
     */
    WidgetList.prototype.clear = function () {
        this._selection.clear();
    };
    /**
     * Computes exactly the size required for the items.
     */
    WidgetList.prototype.resize = function () {
        this.style.height = (this.data.length * this.$.list.height) + 'px';
    };
    Object.defineProperty(WidgetList.prototype, "items", {
        /**
         * Overriding the items selection from selectable.
         * Since the selectable items are inside list and not inside me.
         */
        get: function () {
            var nodes = Polymer.dom(this.$.list).queryDistributedElements(this.selectable || '*');
            return Array.prototype.filter.call(nodes, this._bindFilterItem);
        },
        enumerable: true,
        configurable: true
    });
    return WidgetList;
})(Polymer.DomModule);
window.Polymer(window.Polymer.Base.extend(WidgetList.prototype, {
    is: 'widget-list',
    properties: {
        data: Array
    },
    behaviors: [
        Polymer.IronMultiSelectableBehavior
    ]
}));
