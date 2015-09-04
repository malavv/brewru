/// <reference path="../base/conceptRef.ts" />
/// <reference path="../units/dimension.ts" />
/// <reference path="itemType.ts" />
/// <reference path="stock.ts" />

class Item {
  type: ItemType;
  name: string;
  ref: string;
  stocks: Stock[];

  public static fromRaw(raw: any): Item {
    var i : Item = new Item();

    switch(raw.type) {
      case 'Fermentables':
        i.type = ItemType.Fermentables;
        break;
      case 'Hops':
        i.type = ItemType.Hops;
        break;
      case 'Yeasts':
        i.type = ItemType.Yeasts;
        break;
      case 'Miscellaneous':
        i.type = ItemType.Miscellaneous;
        break;
      case 'Dynamics':
        i.type = ItemType.Dynamics;
        break;
    }
    i.name = raw.name;
    i.ref = raw.ref;
    i.stocks = raw.stocks.map((s: any) => { return Stock.fromRaw(this, s); });
    return i;
  }
}