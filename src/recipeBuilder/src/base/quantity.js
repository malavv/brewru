define([
  'base/concept',
  'base/units'
], function(Concept, Units) {

  /**
   * Represents a scalar magnitude and a unit.
   * @constructor
   */
  function Quantity(magnitude, unit) {
    this.magnitude = magnitude;
    if (!isValidScalar(magnitude)) {
      console.warn("[Quantity] Non-scalar magnitude");
      this.magnitude = 0;
    }
    this.unit = Units.knows(unit) ? unit : new Concept();
  }

  Quantity.prototype.toString = function() {
    return this.magnitude + " " + this.unit;
  };

  function isValidScalar(s) {
    return !isNaN(s) || s === Number.POSITIVE_INFINITY || s === Number.NEGATIVE_INFINITY;
  }

  return Quantity;
});