/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class AppMainWindow extends Polymer.DomModule {
  private selectedSidebar: number;
  private selectedContent: number;
  private shortcuts: Array<{binding: String, description: String, type: Object}>;

  public ready() {
    this.selectedSidebar = 0;
    this.selectedContent = 0;
    console.log('Hello World from AppMw');

    // Pushing to shortcuts for the shortcut behavior.
    this.shortcuts.forEach(function(s) { this.addShortcut(s.binding, s.type); }, this);

    bus.suscribe(MessageType.ShowShortcuts, this._onShowShortcuts, this);
    bus.suscribe(MessageType.RecipeSelected, this._onRecipeSelected, this);
  }

  private _onShowShortcuts() {
    this.async(() => { this.$.shortcutsPanel.open(); });
  }

  private _onRecipeSelected(recipe: any) {
    this.async(() => {
      console.log('MW - recipe', recipe);
      this.selectedContent = 1;
    })
  }
}

window.Polymer(window.Polymer.Base.extend(AppMainWindow.prototype, {
  is: 'app-mw',

  behaviors: [
    ShortcutBehavior
  ],

  properties: {
    selectedContent: Number,
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
            binding: 'alt+s',
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