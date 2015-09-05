/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class WidgetList extends Polymer.DomModule {
  // From IronSelectable
  private _selection: any;
  private select: any;
  private selectable: any;
  private _bindFilterItem: any;
  
  // Polymer element
  private style: any;
  // Properties
  private data: Array<any>;
  
  /**
   * Allows external code to clear the selection.
   * 
   * Watch out for the need to async this. Depending on when you notice the selection.
   */
  public clear() {
    this._selection.clear();
  }
  
  /**
   * Computes exactly the size required for the items.
   */
  private resize() {
    this.style.height = (this.data.length * this.$.list.height) + 'px';
  }
  
  /**
   * Overriding the items selection from selectable.
   * Since the selectable items are inside list and not inside me.
   */
  private get items() {
    var nodes = Polymer.dom(this.$.list).queryDistributedElements(this.selectable || '*');
    return Array.prototype.filter.call(nodes, this._bindFilterItem);
  }
}

window.Polymer(window.Polymer.Base.extend(WidgetList.prototype, {
  is: 'widget-list',

  properties: {
    data: Array
  },
  
  behaviors: [
    Polymer.IronMultiSelectableBehavior
  ]
}));