/// <reference path="../../../src/shortcuts.ts" />
/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/base/Keyboard.ts" />

var Polymer:Function = Polymer || function () {}

class AppShortcuts {
  evt:string = 'Shortcuts';
  listed:Shortcuts;
  $:any;

  ready() {
    this.listed = Shortcuts.default;
    bus.suscribe(MessageType.ShowShortcuts, this.onShowShortcuts, this);
    this.$.overlay.close();
  }

  onShowShortcuts() {
    this.$.overlay.open();
  }

  keypress(event:KeyboardEvent) {
    var
      key = Keyboard.fromEvt(event),
      shortcut = this.listed.map[key.toString()];      
    if (shortcut === undefined) return;
    if (shortcut) bus.publish(shortcut.intent);
  }
}  

Polymer(AppShortcuts.prototype);