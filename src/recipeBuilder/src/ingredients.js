define(
  [
    'entities',
    'base/units',
    'ingredient'
  ],
  function(Entities, Units, Ingredient) {

  function Ingredients() {
    this.inventory = [
      new Ingredient(Entities.tapWater, Infinity , Units.SI.Volume.liter)
    ];
    this.reactors = [
      // {name: 'test', ingredients: []}
    ];
  }

  Ingredients.prototype.addToInventory = function(ingredient) {
    this.inventory.push(ingredient);
  };

  Ingredients.prototype.getFromInventory = function(id) {
    return this.inventory.filter(function(i) { return i.id === id; });
  };

  Ingredients.prototype.takeQty = function(id, qty) {
    var tmp = this.get(id);
    if (tmp.length <= 0) {
      console.error("Ingredients.prototype.takeQty ingredient doesn't exist");
      return null;
    }
    return {
      from: Entities.inventory,
      id: tmp[0].id,
      qty: qty
    };
  };
  return Ingredients;
});