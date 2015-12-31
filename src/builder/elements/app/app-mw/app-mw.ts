/// <reference path="../../../lib/polymer/polymer.ts" />

class AppShortcuts extends Polymer.DomModule {
  ready() {
      console.log('Hello World from AppMw');
  }
}

window.Polymer(window.Polymer.Base.extend(AppShortcuts.prototype, {
  is: 'app-mw'
}));