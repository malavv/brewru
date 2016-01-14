/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class AppSplash extends Polymer.DomModule {
  private isChoosing: Boolean;

  ready() {
    this.isChoosing = false;
  }
  private createNew() {
    bus.publish(MessageType.RecipeSelected, null);
  }
  private loadRecipe() {
    this.isChoosing = true;
  }
  private _onRecipeSelected(evt: any) {
    bus.publish(MessageType.RecipeSelected, evt.target.files[0]);
  }
}

window.Polymer(window.Polymer.Base.extend(AppSplash.prototype, {
  is: 'app-splash',

  properties: {
    isChoosing: Boolean
  }
}));