define([], function() {

	var id = 0;

  function Ingredient(type, magnitude, unit) {
    this.magnitude = magnitude;
    this.unit = unit;
    this.type = type;
    this.id = 'anon:' + id++;
  }

  Ingredient.prototype.toString = function() {
  	return this.type + '('+this.magnitude+':'+this.unit+')';
  };

  return Ingredient;
});