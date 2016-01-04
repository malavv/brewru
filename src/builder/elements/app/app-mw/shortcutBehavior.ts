/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

interface _Shortcut {
  binding: String;
  type: MessageType;
} 

var __shortcuts: Array<_Shortcut> = [];

var ShortcutBehaviorImpl = {
  __shortcuts: __shortcuts,

  properties: {
  },

  keyBindings: {
  },

  attached() {
    this.keyEventTarget = document.body;
  },

  addShortcut(binding: String, type: MessageType) {
    this.addOwnKeyBinding(binding, '_keyPressed');
    this.__shortcuts.push({
      binding: binding,
      type: type
    });
  },

  _keyPressed(evt:any) {
    this.__shortcuts
      .filter(function(s: _Shortcut) { return this.keyboardEventMatchesKeys(evt.detail.keyboardEvent, s.binding); }, this)
      .forEach(function(s: _Shortcut) { bus.publish(s.type); }, this)
  }
}

var ShortcutBehavior = [Polymer.IronA11yKeysBehavior, ShortcutBehaviorImpl];