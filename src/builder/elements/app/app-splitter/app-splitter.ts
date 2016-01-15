/// <reference path="../../../lib/polymer/polymer.ts" />

class AppSplitter extends Polymer.DomModule {
  ready() {
  }
}

window.Polymer(window.Polymer.Base.extend(AppSplitter.prototype, {
  is: 'app-splitter',

  properties: {
    locked: {
      type: Boolean
    },
    minSize: {
      type: String
    }
  }
}));