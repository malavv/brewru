/// <reference path="../../../src/defs/polymer/polymer.ts" />

/// <reference path="../../../src/base/keyboard.ts" />

class WidgetText extends Polymer.DomModule {
  commited:string;
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
    this._cancel();
  }
  onFocus() {
    this.commited = this.value;
  }
  onKeyup(evt:KeyboardEvent) {
    switch(Keyboard.fromEvt(evt).binding) {
      case 'enter': this._commit(); break;
      case 'esc': this._cancel(); break;
    }
    evt.stopPropagation();
  }

  // Methods
  private _cancel() {
    this.selected = 1;
    this.value = this.commited;
  }
  private _commit() {
    this.commited = this.value;
    this.selected = 1;
  }
}

window.Polymer(window.Polymer.Base.extend(WidgetText.prototype, {
  is: 'widget-text',

  properties: {
    commited: {
      type: String,
      value: ''
    },
    selected: {
      type: Number,
      value: 1
    },
    value: {
      type: String
    }
  },

  listeners: {
    'click': 'onClick',
    'keyup': 'onKeyup'
  }
}));