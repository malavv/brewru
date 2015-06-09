/// <reference path="../../../src/base/keyboard.ts" />

var Polymer:Function = Polymer || function () {}

class WidgetText {
  $: any;
  isEditMode: boolean = false;
  
  ready() {}
  
  onTap() {
      if (this.isEditMode) 
        return false;
      this.isEditMode = true
      window.setTimeout(() => {
        this.$.input.focus();
        this.$.input.select();
      });
      return false;
  }
  
  onKey(e:KeyboardEvent) {
      if (Keyboard.fromEvt(e).binding !== 'enter') 
        return false;
      this.isEditMode = false;
      return false;
  }
}

Polymer(WidgetText.prototype);