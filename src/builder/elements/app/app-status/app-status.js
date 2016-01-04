/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AppStatus = (function (_super) {
    __extends(AppStatus, _super);
    function AppStatus() {
        _super.apply(this, arguments);
    }
    AppStatus.prototype.ready = function () {
        this.isConnected = true;
        this.message = "";
        bus.suscribe(MessageType.UnsuccessfulConnection, this.onNotConnected, this);
        bus.suscribe(MessageType.ServerConnected, this.onConnected, this);
        bus.suscribe(MessageType.StatusUpdate, this.onNewStatus, this);
    };
    AppStatus.prototype.onNotConnected = function () {
        this.isConnected = false;
        this.message = "Check server connection";
    };
    AppStatus.prototype.onConnected = function () {
        this.isConnected = true;
    };
    AppStatus.prototype.onNewStatus = function (msg) {
        this.message = msg;
    };
    return AppStatus;
})(Polymer.DomModule);
window.Polymer(window.Polymer.Base.extend(AppStatus.prototype, {
    is: 'app-status',
    properties: {
        isConnected: Boolean,
        message: String
    }
}));
