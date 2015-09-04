/// <reference path="item.ts" />

class Stock {
  item: Item;
  quantity: Quantity;
  boughtOn: Date;
  provider: String;

  public static fromRaw(item: Item, raw: any): Stock {
    var s = new Stock();
    s.item = item;
    s.quantity = raw.quantity;
    s.boughtOn = new Date(raw.boughtOn);
    s.provider = raw.provider;
    return s;
  }
}