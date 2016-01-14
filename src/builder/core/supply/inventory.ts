/// <reference path="item.ts" />
/// <reference path="itemType.ts" />

/// <reference path="../base/eventBus.ts" />
/**
 * The inventory is a collection of items having types and which can be part of stocks.
 *
 * Fermentables, for examples, is a type of items. A certain quantity of an item, purchased
 * at a certain time, from a certain supplier is a stock.
 */
class Inventory {
  private items: Item[];
  private stocks: Stock[];

  constructor() {
    this.items = [];
    this.stocks = [];
  }

  public listItem(type?: ItemType) {
    if (type === undefined)
      return this.items;
    return this.items.filter((i) => { return i.type === type; });
  }

  public addItem(item: Item) {
    this.items.push(item);
    item.stocks.forEach((s) => { this.stocks.push(s); })
    bus.publish(MessageType.InventoryChanged);
  }
}