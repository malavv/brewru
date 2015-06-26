/// <reference path="../../../src/base/polymer.d.ts" />

class WidgetText {
  $:any;
  isEditMode: boolean = false;
  commitedVal: string;
  
  onTap() {
      this.isEditMode = true;

      window.setTimeout(() => {
        this.$.editor.focus();
        this.$.editor.select();  
      });
      return false;
  }
  
  commitedValChanged() {
    this.isEditMode = false;    
  }
}

if (!Polymer.getRegisteredPrototype('widget-text')) {
  Polymer('widget-text', WidgetText.prototype);
}