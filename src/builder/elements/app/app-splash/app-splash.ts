/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class AppSplash extends Polymer.DomModule {
  ready() {
  }
}

window.Polymer(window.Polymer.Base.extend(AppSplash.prototype, {
  is: 'app-splash',

  properties: {
  }
}));