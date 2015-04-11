define(
	['entities'],
	function(Entities) {

  function Quantity(magnitude, unit) {
    this.magnitude = magnitude;
    this.unit = unit;
  }

  Quantity.si = {
    kg: Entities.kg,
    l: Entities.liter,
  };

  return Quantity;
});