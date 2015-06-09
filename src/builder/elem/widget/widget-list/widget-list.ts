/// <reference path="../../../src/base/codes.ts" />

var Polymer:Function = Polymer || function () {}

class WidgetList {
  data = []
  selection:any
  $:any
  style:any;
  
  ready() {}
  /** On request made. */
  dataChanged(oldV, newV) { this.resize(); }
  handleEvent(event:KeyboardEvent) {
    var codes = new Codes();
    var idx = codes.base2int(String.fromCharCode(event.which));
    if (idx < 0 || idx >= this.data.length) return;
    this.$.list.selectItem(idx);
  }
  resize() {
    this.style.height = (this.data.length * this.$.list.height) + 'px';
  }
}

Polymer(WidgetList.prototype);