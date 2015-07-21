/// <reference path="../../../src/defs/polymer/polymer.ts" />

/// <reference path="../../../src/base/keyboard.ts" />

class WidgetText {
  is:string = 'widget-text';
  
  $:any;
  commited:string;
  listeners:any;
  properties:any;
  selected:number;
  value:string;
  
  // Events
  onClick() {
    this.selected = 0;
    window.setTimeout(() => {
      this.$.editor.focus();
      this.$.editor.select();  
    });
  }
  onBlur() { 
    this.cancel(); 
  }
  onFocus() { 
    this.commited = this.value; 
  }
  onKeyup(evt:KeyboardEvent) {
    switch(Keyboard.fromEvt(evt).binding) {
      case 'enter': this.commit(); break;
      case 'esc': this.cancel(); break;
    }
  }
  
  // Methods
  cancel() {
    this.selected = 1;
    this.value = this.commited;
  }
  commit() {
    this.commited = this.value;
    this.selected = 1;
  }
}
WidgetText.prototype.is = 'widget-text';

WidgetText.prototype.listeners = {
  'keyup': 'onKeyup',
  'click': 'onClick'
}

WidgetText.prototype.properties = {
  value: {
    type: String
  },
  commited: {
    type: String,
    value: ''            
  },
  selected: {
    type: Number,
    value: 1
  }
}