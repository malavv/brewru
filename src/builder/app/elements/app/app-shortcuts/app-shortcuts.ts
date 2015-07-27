/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/base/keyboard.ts" />
/// <reference path="../../../src/base/messageType.ts" />
/// <reference path="../../../src/defs/polymer/polymer.ts" />
/// <reference path="../../../src/shortcuts.ts" />

/**
 * Shortcuts for this application.
 * Note<malavv> : Not sure why it is there.
 */
var shortcuts: Shortcuts = new Shortcuts()
  .add('alt+S', MessageType.CreateStep, 'Create new step')
  .add('shift+6', MessageType.ShowShortcuts, 'Toggle Visibility of Shortcuts')
  .add('esc', MessageType.Cancel, 'Cancel current action.');

/**
 * Manages presenting available shortcuts and feeding them in PubSub.
 */
class AppShortcuts extends Polymer.DomModule {
  /* Is the Panel Opened? Coming from IronOverlay. */
  private opened: boolean;
  /* Currently listed shortcuts. */
  private listed: Shortcuts;

  ready() {
    this.listed = shortcuts;
    this.opened = false;
    //window.addEventListener('keyup', (e: KeyboardEvent) => { this.onKeyUp(e); }, false);
    //bus.suscribe(MessageType.ShowShortcuts, () => { this.opened = true; }, this);
  }

  /**
   * On all key in the application (Using key-up to also get none aphabetic keys.)
   * @param event Keyboard event of the pressed key.
   */
  private onKeyUp(event: KeyboardEvent) {
    var key = Keyboard.fromEvt(event);
    if (!this.listed.hasKey(key)) return;
    bus.publish(this.listed.get(key).intent);
  }

  _showShortcuts() {
    this.opened = true;
  }
  _createNewStep() {
    bus.publish(MessageType.CreateStep); 
  }
}

window.Polymer(window.Polymer.Base.extend(AppShortcuts.prototype, {
  is: 'app-shortcuts',

  behaviors: [
    Polymer.IronOverlayBehavior
  ],

  properties: {
    target: {
      type: Object,
      value: function() { return document.body; }
    }
  }
}));