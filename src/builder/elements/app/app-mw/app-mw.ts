/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class AppMainWindow extends Polymer.DomModule {
  public ready() {
    this.selectedSidebar = 0;
    console.log('Hello World from AppMw');

    // Pushing to shortcuts for the shortcut behavior.
    this.shortcuts.forEach(function(shortcut) {
      this.addShortcut(shortcut.binding, shortcut.type);  
    }, this);

    bus.suscribe(MessageType.ShowShortcuts, this._onShowShortcuts, this);
  }

  private _onShowShortcuts() {
    this.async(() => { this.$.shortcutsPanel.open(); });
  }
}

window.Polymer(window.Polymer.Base.extend(AppMainWindow.prototype, {
  is: 'app-mw',

  behaviors: [
    ShortcutBehavior
  ],

  properties: {
    shortcuts: {
      type: Array,
      value: function() {
        return [
        {
          binding: 'shift+6',
          description: 'Show Shortcut',
          type: MessageType.ShowShortcuts
        },
        {
            binding: 'alt+S',
            description: 'Create new step',
            type: MessageType.CreateStep
        },
        {
            binding: 'esc',
            description: 'Cancel current Action',
            type: MessageType.Cancel
        }
        ];
      }
    }
  }
}));