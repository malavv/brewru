/// <reference path="ingredient" />

/**
 * The inventory is a collection of items having types and which can be part of stocks.
 *
 * Fermentables, for examples, is a type of items. A certain quantity of an item, purchased
 * at a certain time, from a certain supplier is a stock.
 */
class Inventory {
  private items: Supply.Ing[];
  private stocks: Object[];

  constructor() {
    this.items = [];
    this.stocks = [];
  }
}