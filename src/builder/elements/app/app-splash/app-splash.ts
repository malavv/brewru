/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class AppSplash extends Polymer.DomModule {
  private selected: Number;

  ready() {
  }

  createNew() {
    this.selected = 1;
    console.log('create new');
  }
}

window.Polymer(window.Polymer.Base.extend(AppSplash.prototype, {
  is: 'app-splash',

  properties: {
    selected: {
      type: Number,
      value: 0,
      notify: true
    }
  }
}));