define(function() {

  function Step(name, id, type, inputs, outputs) {
  	this.id = id;
    this.name = name;
    this.type = type;
    this.inputs = inputs;
    this.outputs = outputs;
  }

  Step.prototype.toString = function() {
  	return JSON.stringify(this.inputs) + ' -> ' + this.name  + ' -> ' + JSON.stringify(this.outputs);
  };

  return Step;
});