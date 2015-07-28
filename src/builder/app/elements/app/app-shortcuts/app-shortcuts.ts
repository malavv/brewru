/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/base/messageType.ts" />
/// <reference path="../../../src/defs/polymer/polymer.ts" />

class AppShortcuts extends Polymer.DomModule {
  private opened: boolean;
  private listed: {binding:string; description:string}[];

  ready() {
    this.opened = false;
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
    listed: {
      type: Array,
      value: [
        { binding: 'alt+S', description: 'Create new step' },
        { binding: 'shift+6', description: 'Toggle Visibility of Shortcuts' },
        { binding: 'esc', description: 'Cancel current action' }
      ]
    },
    target: {
      type: Object,
      value: function() { return document.body; }
    }
  }
}));