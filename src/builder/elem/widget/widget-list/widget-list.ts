/// <reference path="../../../src/base/codes.ts" />

var Polymer:Function = Polymer || function () {}

class WidgetList {
  private data:Array<any> = [];
  private selection:any;
  private $:any;
  private style:any;
  private handle: EventListener = (evt: Event) => {
    this.handleKey(<KeyboardEvent>evt);
  }

  /** Used with loose focus to enable keyboard selection. */
  public grabFocus() { window.addEventListener('keypress', this.handle, false); }
  /** Used with grab focus to enable keyboard selection. */
  public looseFocus() { window.removeEventListener('keypress', this.handle, false); }
  
  private handleKey(evt: KeyboardEvent) : void {
    var
      codes = new Codes(),
      idx = codes.base2int(String.fromCharCode(evt.which));
    if (idx < 0 || idx >= this.data.length) return;
    this.$.list.selectItem(idx);
    evt.preventDefault();
  }

  /** On request made. */
  private dataChanged(oldVal:any, newVal:any) { this.resize(); }

  private resize() {
    this.style.height = (this.data.length * this.$.list.height) + 'px';
  }
}

Polymer(WidgetList.prototype);