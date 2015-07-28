/// <reference path="../../../src/defs/polymer/polymer.ts" />

/// <reference path="../../../src/base/codes.ts" />

class WidgetList extends Polymer.DomModule {
  private static codes:base.BaseConvert = new base.KeyboardBase();
  
  // Properties
  private _selection: any;  
  
  private style:any;
  
  private _selectRow(template: any) {
    this.select(template.model.item);
  }
  
  private resize() {
    this.style.height = (this.items.length * this.$.list.height) + 'px';
  }
  
  _itemsChanged() {
    console.log('_itemsChanged');
  }
  
  _toBase(idx : any) {
    return WidgetList.codes.toCode(idx);
  }
}

window.Polymer(window.Polymer.Base.extend(WidgetList.prototype, {
  is: 'widget-list',

  properties: {
    items: Array
  },
  
  behaviors: [
    Polymer.IronMultiSelectableBehavior
  ],
  
  observers: [
    '_itemsChanged(items.*)'
  ]
}));