// This is not the right way, just a quick fix to go forward.
define([
  'base/concept'
],
function(Concept) {
  return {
    unknown: new Concept('internal:unknownUnit', 'N/A'),
    SI: {
      Mass: {
        kilogram: new Concept('brew:kilogram', 'kg'),
        gram: new Concept('brew:gram', 'g')
      },
      Volume: {
        liter: new Concept('brew:liter', 'l')
      },
      Length: {
        meter: new Concept('brew:meter', 'm')
      }
    },
    USCust: {
      Mass: {
        ounce: new Concept('brew:ounce', 'oz'),
        pound: new Concept('brew:pound', 'lb')
      },
      Volume: {
        quart: new Concept('brew:quart', 'qt')
      },
      Length: {
        inch: new Concept('brew:inch', 'in')
      }
    },

    knows: function(concept) {
      if (this.SI.Mass.kilogram === concept) return true;
      if (this.SI.Volume.liter === concept) return true;
      return false;
    }
  }
});