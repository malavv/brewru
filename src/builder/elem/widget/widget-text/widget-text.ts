/// <reference path="../../../src/base/polymer.d.ts" />

class WidgetText {
  is:string = 'widget-text';
  
  $:any;
  isEditMode: boolean = false;
  commitedVal: string;
  
  properties:any = {
    text: {
      type: String,
      value: ""
    }
  };
  
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