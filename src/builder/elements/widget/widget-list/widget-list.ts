/// <reference path="../../../src/base/polymer.d.ts" />
/// <reference path="../../../src/base/codes.ts" />

class WidgetList {
  is:string = 'widget-list';
  
  private static codes:base.BaseConvert = new base.KeyboardBase();
  private $:any;
  private style:any;
  private handle: EventListener = (evt: Event) => {
    this.handleKey(<KeyboardEvent>evt);
  }

  properties:any = {
    data: {
      type: Array,
      value: []
    },
    selection: {
      type: Object,
      value: undefined
    }
  }

  /** Used with loose focus to enable keyboard selection. */
  public grabFocus() { window.addEventListener('keypress', this.handle, false); }
  /** Used with grab focus to enable keyboard selection. */
  public looseFocus() { window.removeEventListener('keypress', this.handle, false); }
  
  private handleKey(evt: KeyboardEvent) : void {
    var
        idx = WidgetList.codes.toIdx(String.fromCharCode(evt.which));
    if (idx < 0 || idx >= this.properties.data.length) return;
    this.$.list.selectItem(idx);
    evt.preventDefault();
  }

  /** On request made. */
  private dataChanged(oldVal:any, newVal:any) { this.resize(); }

  private resize() {
    this.style.height = (this.properties.data.length * this.$.list.height) + 'px';
  }

  toBase(idx:number):string {
    return WidgetList.codes.toCode(idx);
  }
}