define(
  [
  'base/concept',
  'base/units',
  'underscore'
  ],
  function(Concept, Units) {

  function Ingredient(concept, magnitude, unit) {
    this.concept = concept instanceof Concept ? concept : new Concept();
    this.magnitude = magnitude;
    this.unit = Units.knows(unit) ? unit : new Concept();
  }

  Ingredient.prototype.toString = function() {
    return _.template('{{concept.id}}({{magnitude}}{{unit}})')(this);
  };

  Ingredient.prototype.printQty = function() {
    return this.magnitude + ' ' + this.unit.name;
  };

  return Ingredient;
});