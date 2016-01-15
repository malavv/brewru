/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class AppInventory extends Polymer.DomModule {
  private inventory: Inventory;

  ready() {
    this.inventory = new Inventory();

    bus.suscribe(MessageType.ServerConnected, (server) => {
      this.async(() => {
        console.log('app-inventory');
        this.onSynchronize(server); });
    }, this);
  }

  onSynchronize(server: any) {
    server.syncInventory()
      .then((response: any) => {
        bus.publish(MessageType.StatusUpdate, "Filling inventory with Server data.");
        response.items.forEach((item: any) => {
          this.inventory.addItem(Item.fromRaw(item));
        });
        bus.publish(MessageType.StatusUpdate, "Done");
      })
      .catch((error:any) => {
        console.warn('server error : ' + JSON.stringify(error));
      });
  }
}

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