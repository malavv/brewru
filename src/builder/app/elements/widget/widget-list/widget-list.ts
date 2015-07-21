/// <reference path="../../../src/defs/polymer/polymer.ts" />

/// <reference path="../../../src/base/codes.ts" />

class WidgetList extends Polymer.DomModule {
  private static codes:base.BaseConvert = new base.KeyboardBase();  
  private data:Array<any>;
  private style:any;
  private handle: EventListener = (evt: Event) => { this.handleKey(<KeyboardEvent>evt); }

  /** Used with loose focus to enable keyboard selection. */
  public grabFocus() { window.addEventListener('keypress', this.handle, false); }
  /** Used with grab focus to enable keyboard selection. */
  public looseFocus() { window.removeEventListener('keypress', this.handle, false); }
  
  private handleKey(evt: KeyboardEvent) : void {
    var
        idx = WidgetList.codes.toIdx(String.fromCharCode(evt.which));
    if (idx < 0 || idx >= this.data.length) return;
    this.$.list.selectItem(idx);
    evt.preventDefault();
  }

  /** On request made. */
  private dataChanged(oldVal:any, newVal:any) { this.resize(); }

  private resize() {
    this.style.height = (this.data.length * this.$.list.height) + 'px';
  }

  toBase(idx:number):string {
    return WidgetList.codes.toCode(idx);
  }
}

WidgetList.prototype.is = 'widget-list';
WidgetList.prototype.properties = {
  data: {
    type: Array,
    value: [],
    observer: 'dataChanged'
  },
  selection: {
    type: Object,
    value: undefined
  }
}