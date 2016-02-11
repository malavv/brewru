/// <reference path="../../../lib/polymer/polymer.ts" />

class ShortcutPanel extends Polymer.DomModule {
  private shortcuts: Array<{binding: String, description: String, type: Object}>;

  public ready() {
    bus.suscribe(MessageType.ShowShortcuts, this.show, this);
  }

  public show() {
    this.async(() => {
      var dialog : any = this.$$('paper-dialog');
      dialog.open();
    });
  }
}

window.Polymer(window.Polymer.Base.extend(ShortcutPanel.prototype, {
  is: 'shortcut-panel',

  properties: {
    shortcuts: Array
  }
}));