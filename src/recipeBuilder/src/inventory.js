define(['ingredient'], function(Ingredient) {

  function Inventory() {
    this.ingredients = [
    	new Ingredient('brew:tapWater', Infinity , 'brew:liter')
    ];
  }

  Inventory.prototype.add = function(ingredient) {
  	this.ingredients.push(ingredient);
  };

  return Inventory;
});