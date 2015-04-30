define([
  'base/concept',
  'base/quantity',
  'base/units',
  'underscore'
], function(Concept, Qty, Units) {

  /**
   * Represents an ingredient, with a quantity and provenance.
   * @constructor
   */
  function Ingredient(concept, qty) {
    if (!(concept instanceof Concept))
      console.warn("[Ingredient] Concept not a concept object", concept);
    if (!(qty instanceof Qty))
      console.warn("[Ingredient] Quantity not a qty object", qty);

    this.concept = concept instanceof Concept ? concept : new Concept();
    this.quantity = qty instanceof Qty ? qty : new Qty(0, Units.unknown);
  }

  Ingredient.prototype.toString = function() {
    return _.template('{{concept.id}}({{quantity}})')(this);
  };

  return Ingredient;
});