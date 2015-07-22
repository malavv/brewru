/// <reference path="../../../src/defs/polymer/polymer.ts" />

/// <reference path="../../../src/base/codes.ts" />

class WidgetList extends Polymer.DomModule {
  private static codes:base.BaseConvert = new base.KeyboardBase();
  
  private items: Array<any>;
  private selected: any;
  private _selectedModel: any;
  
  private style:any;
  private handle: EventListener = (evt: Event) => { this.handleKey(<KeyboardEvent>evt); }

  /** Used with loose focus to enable keyboard selection. */
  public grabFocus() { window.addEventListener('keypress', this.handle, false); }
  /** Used with grab focus to enable keyboard selection. */
  public looseFocus() { window.removeEventListener('keypress', this.handle, false); }
  
  private handleKey(evt: KeyboardEvent) : void {
    var
        idx = WidgetList.codes.toIdx(String.fromCharCode(evt.which));
    if (idx < 0 || idx >= this.items.length) return;
    this.$.list.selectItem(idx);
    evt.preventDefault();
  }

  private resize() {
    this.style.height = (this.items.length * this.$.list.height) + 'px';
  }
  
  _onTap(evt:any) {
    if (this._selectedModel) {
      this._selectedModel.classList.remove('iron-selected');
    }
    this._selectedModel = evt.target;
    this._selectedModel.classList.add('iron-selected');
    this.selected = evt.model.item;
  }
  
  _itemsChanged() {
    this._reset();
  }
  _toBase(idx : any) {
    return WidgetList.codes.toCode(idx);
  }
  
  private _reset() {
    if (this._selectedModel !== undefined) {
      this._selectedModel.classList.remove('iron-selected');
      this._selectedModel = undefined;
    }
    this.selected = undefined;
  }
}

window.Polymer(window.Polymer.Base.extend(WidgetList.prototype, {
  is: 'widget-list',

  properties: {
    items: {
      type: Array,
      value: []
    },
    
    selected: {
      type: String,
      notify: true
    },
    
    _selectedModel: {
      type: Object
    }
  },
  
  observers: [
    '_itemsChanged(items.*)'
  ]
}));