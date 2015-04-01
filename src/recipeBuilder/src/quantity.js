define(
[],
function() {

  function Quantity(magnitude, unit) {
    this.magnitude = magnitude;
    this.unit = unit;
  }

  Quantity.si = {
    kg: 'unit:kilogram',
    l: 'unit:liter',
  };

  return Quantity;
});