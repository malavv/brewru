/// <reference path="../../../lib/polymer/polymer.ts" />

class CommonTool extends Polymer.DomModule {
  handle: String;
  type: String;

  public getHandle() {
    return this.handle;
  }
}

window.Polymer(window.Polymer.Base.extend(CommonTool.prototype, {
  is: 'common-tool',

  properties: {
    icon: {
      type: String
    },
    handle: {
      type: String
    }
  }
}));