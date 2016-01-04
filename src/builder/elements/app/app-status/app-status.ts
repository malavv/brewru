/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class AppStatus extends Polymer.DomModule {
  isConnected: Boolean;
  message: String;

  ready() {
    this.isConnected = true;
    this.message = "";
    bus.suscribe(MessageType.UnsuccessfulConnection, this.onNotConnected, this);
    bus.suscribe(MessageType.ServerConnected, this.onConnected, this);
    bus.suscribe(MessageType.StatusUpdate, this.onNewStatus, this);
  }

  onNotConnected() {
    this.isConnected = false;
    this.message = "Check server connection";
  }
  onConnected() {
    this.isConnected = true;
  }
  onNewStatus(msg: String) {
    this.message = msg;
  }
}

window.Polymer(window.Polymer.Base.extend(AppStatus.prototype, {
  is: 'app-status',

  properties: {
    isConnected: Boolean,
    message: String
  }
}));