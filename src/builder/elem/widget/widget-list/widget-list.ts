/// <reference path="../../../src/base/codes.ts" />

var Polymer:Function = Polymer || function () {}

class WidgetList {
  private data = []
  private selection:any
  private $:any
  private style:any;
  
  ready() {}
  
  grabFocus() { window.addEventListener('keypress', this, false); }
  looseFocus() { window.removeEventListener('keypress', this, false); }
  
  /** On request made. */
  private dataChanged(oldV, newV) { this.resize(); }
  
  public handleEvent(event:Event) : void {
    var 
      codes = new Codes(),
      idx = codes.base2int(String.fromCharCode((<KeyboardEvent>event).which));
    if (idx < 0 || idx >= this.data.length) return;
    this.$.list.selectItem(idx);
    event.preventDefault();
  }
  private resize() {
    this.style.height = (this.data.length * this.$.list.height) + 'px';
  }
}

Polymer(WidgetList.prototype);