/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class AppStatus extends Polymer.DomModule {
  ready() {
  }
}

window.Polymer(window.Polymer.Base.extend(AppStatus.prototype, {
  is: 'app-status',

  properties: {
    isConnected: {
      type: Boolean,
      value: true
    },
    message: {
      type: String,
      value: ""
    }
  },
  
  ready() {
    bus.suscribe(MessageType.UnsuccessfulConnection, () => { 
      this.isConnected = false;
      this.message = "Check server connection";  
    }, this);
    bus.suscribe(MessageType.ServerConnected, () => { 
      this.isConnected = true; 
    }, this);
    bus.suscribe(MessageType.StatusUpdate, (msg) => { 
      this.message = msg; 
    }, this);
  }
}));