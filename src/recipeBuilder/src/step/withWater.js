define(['step'], function(Step) {

  function WithWater(name, inputs, outputs) {
    Step.call(this, name, inputs, outputs);

    this.reactor.use = Step.reactorUse.create;

    //console.log(this.toString());
  }

  WithWater.create = function(name) {
    var
      inputs = [],
      outputs = [],
      bld = {
        addInput: function(input) { inputs.push(input); return bld; },
        addOutput: function(output) { outputs.push(output); return bld; },
        build: function(input) { return new WithWater(name, inputs, outputs); }
      };
    return bld;
  }

  WithWater.prototype = Step.prototype;

  WithWater.prototype.constructor = WithWater;

  return WithWater;
});