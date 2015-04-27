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

  Ingredients.prototype.listAllIngredients = function() {
    return [].concat(this.inventory).concat(this.reactors.map(function(r) { return r.ingredients; }));
  };

  Ingredients.prototype.getFromInventory = function(id) {
    return this.inventory.filter(function(i) { return i.id === id; });
  };

  Ingredients.prototype.addSrc = function(reactor) {
    if (this.reactors.every(function(s) { return s.id !== reactor.id; })) {
      this.reactors.push({
        id: reactor.id,
        name: reactor.name,
        ingredients: []
      });
    }
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