/// <reference path="../../../lib/polymer/polymer.ts" />

enum WidgetTextState {
  placeholder,
  editing,
  display
}

class WidgetText extends Polymer.DomModule {
  private selected: number;
  private placeholder: string;
  private value: string;

  public ready() {
    this.selected = WidgetTextState.placeholder;
    if (this.placeholder == null)
      this.placeholder = '--placeholder--';
  }

  private _setEditing(isEditing : boolean) {
    if (isEditing) {
      this.selected = WidgetTextState.editing;
      return;
    }

    if (this.value == '')
      this.selected = WidgetTextState.placeholder;
    else
      this.selected = WidgetTextState.display;
  }

  private _valueChangedHandler() {
    if (this.value == null)  this.value = '';
    this.value = this.value.trim();
    this._setEditing(false);
  }

  private _clickHandler() {
    this._setEditing(true);
    this.async(() => {
      this.$.editor.focus();
      this.$.editor.select();
    }, 1);
  }
}

window.Polymer(window.Polymer.Base.extend(WidgetText.prototype, {
  is: 'widget-text',

  properties: {
    selected: Number,
    value: {
      type: String,
      observer: '_valueChangedHandler',
      notify: true
    },
    placeholder: String
  },

  listeners: {
    'click': '_clickHandler'
  }
}));