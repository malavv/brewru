/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AppInventory = (function (_super) {
    __extends(AppInventory, _super);
    function AppInventory() {
        _super.apply(this, arguments);
    }
    AppInventory.prototype.ready = function () {
        var _this = this;
        this.inventory = new Inventory();
        bus.suscribe(MessageType.ServerConnected, function (server) {
            _this.async(function () { _this.onSynchronize(server); });
        }, this);
    };
    AppInventory.prototype.onSynchronize = function (server) {
        var _this = this;
        server.syncInventory()
            .then(function (response) {
            bus.publish(MessageType.StatusUpdate, "Filling inventory with Server data.");
            response.items.forEach(function (item) {
                _this.inventory.addItem(Item.fromRaw(item));
            });
            bus.publish(MessageType.StatusUpdate, "Done");
        })
            .catch(function (error) {
            console.warn('server error : ' + JSON.stringify(error));
        });
    };
    return AppInventory;
})(Polymer.DomModule);
window.Polymer(window.Polymer.Base.extend(AppInventory.prototype, {
    is: 'app-inventory',
    properties: {
        inventory: {
            type: Object,
            notify: true
        }
    },
    hostAttributes: {
        hidden: true
    }
}));
