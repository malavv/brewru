define([
  'base/concept'
], function(Concept) {

  /**
   * Source of ingredients for the recipe.
   * @constructor
   */
  function IngredientSrc(name, ref) {
    this.ref = ref || new Concept();
    this.name = name || 'Anonymous';
    this.stocks = [];
  }

  IngredientSrc.prototype.addAll = function(items) {
    this.stocks = this.stocks.concat(items);
    return this;
  };

  return IngredientSrc;
});