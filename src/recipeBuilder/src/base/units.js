// This is not the right way, just a quick fix to go forward.
define(
  [
  'base/concept'
  ],
  function(Concept) {

  function Units() {}

  Units.SI = {};
  Units.SI.Mass = {
    kilogram: new Concept('brew:kilogram', 'kg')
  };
  Units.SI.Volume = {
    liter: new Concept('brew:liter', 'l')
  };

  Units.knows = function(concept) {
    if (Units.SI.Mass.kilogram === concept) return true;
    if (Units.SI.Volume.liter === concept) return true;
    return false;
  };

  return Units;
});