define(
  [
    'base/concept',
    'base/units',
    'ingredient'
  ],
  function(Concept, Units, Ingredient) {

  function Inventory() {
    this.ingredients = [
      new Ingredient(new Concept('brew:tapWater', 'Tap Water'), Infinity , Units.SI.Volume.liter)
    ];
  }

  Inventory.prototype.add = function(ingredient) {
    this.ingredients.push(ingredient);
  };

  Inventory.prototype.get = function(id) {
    return this.ingredients.filter(function(i) { return i.id === id; });
  };

  Inventory.prototype.takeQty = function(id, qty) {
    var tmp = this.get(id);
    if (tmp.length <= 0) {
      console.error("Inventory.prototype.takeQty ingredient doesn't exist");
      return null;
    }
    return {
      from: 'brew:inventory',
      id: tmp[0].id,
      qty: qty
    };
  };
  return Inventory;
});