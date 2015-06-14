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
    var key = Keyboard.fromEvt(event);

    if (this.isIgnoredSource(event)) return;
    if (!this.listed.hasKey(key)) return;
    bus.publish(this.listed.get(key).intent);
  }

  private isIgnoredSource(event:any) : boolean {
    switch(event.path[0].tagName) {
      case 'INPUT': return true;
      case 'BODY': return false;
      default:
        console.log('AppShortcuts[isIgnoredSource]<default>', event.path[0].tagName);
      return false;
    }
  }
}

Polymer(AppShortcuts.prototype);