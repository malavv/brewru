/// <reference path="../base/bus.ts" />
/// <reference path="../base/log.ts" />
/// <reference path="../knowledge/domain/substance.ts"/>

/**
 * The inventory is a collection of items having types and which can be part of stocks.
 *
 * Fermentables, for examples, is a type of items. A certain quantity of an item, purchased
 * at a certain time, from a certain supplier is a stock.
 */
class Inventory {
  private stocks: { [type : string]: Stock[] } = {};
  private _ingredients: Substance[] = []

  get ingredients() : Substance[] {
    return this.ingredients;
  }

  stocksForIng(ingredient: Substance) : Stock[] {
    return this.stocks[ingredient.iri] || [];
  }

  public addIng(ingredient: Substance) {
    if (this.stocks[ingredient.iri] != null) {
      Log.warn('Inventory', 'Adding an existing substance ' + ingredient.iri);
      return;
    }
    this.add(ingredient, []);
  }

  public addStock(ingredient: Substance, stock: (Stock | Stock[])) {
    if (this.stocks[ingredient.iri] == null) {
      Log.warn('Inventory', 'Unknown substance ' + ingredient.iri + ' consider adding it first');
      return;
    }
    if (stock instanceof Stock) {
      this.stocks[ingredient.iri].push(<Stock>stock);
      return;
    }
    this.stocks[ingredient.iri] = this.stocks[ingredient.iri].concat(<Stock[]>stock);
  }

  public add(ingredient: Substance, stocks: Stock[]) {
    this.addIng(ingredient);
    this.addStock(ingredient, stocks);
  }
}
