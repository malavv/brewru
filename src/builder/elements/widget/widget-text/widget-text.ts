/// <reference path="../../../lib/polymer/polymer.ts" />

class WidgetText extends Polymer.DomModule {
  private selected : number;
  private value : string;

  private _clickHandler() {
    this._setEditing(true);
    this.async(() => {
      this.$.editor.focus();
      this.$.editor.select();
    }, 1);
  }
  private _setEditing(isEditing : boolean) {
    this.selected = isEditing ? 0 : 1;
  }
  private _valueHandler() {
    this._setEditing(false);
  }
}

window.Polymer(window.Polymer.Base.extend(WidgetText.prototype, {
  is: 'widget-text',

  properties: {
    selected: {
      type: Number,
      value: 1
    },
    value: {
      type: String,
      observer: '_valueHandler',
      notify: true
    }
  },

  listeners: {
    'click': '_clickHandler'
  }
}));