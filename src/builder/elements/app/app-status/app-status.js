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
    };
    return AppStatus;
})(Polymer.DomModule);
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
    ready: function () {
        var _this = this;
        bus.suscribe(MessageType.UnsuccessfulConnection, function () {
            _this.isConnected = false;
            _this.message = "Check server connection";
        }, this);
        bus.suscribe(MessageType.ServerConnected, function () {
            _this.isConnected = true;
        }, this);
        bus.suscribe(MessageType.StatusUpdate, function (msg) {
            _this.message = msg;
        }, this);
    }
}));
