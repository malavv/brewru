define(['step'], function(Step) {

  // Define events here?
  // Then set end on an event?
  function Heating(name, inputs, outputs, reactor) {
    Step.call(this, name, inputs, outputs);

    this.reactor.use = Step.reactorUse.use;
    this.reactor.in.push(reactor);
    this.reactor.out.push(reactor);
  }

  Heating.create = function(name, reactor) {
    var
      inputs = [],
      outputs = [],
      bld = {
        addInput: function(input) { inputs.push(input); return bld; },
        addOutput: function(output) { outputs.push(output); return bld; },
        build: function(input) { return new Heating(name, inputs, outputs, reactor); }
      };
    return bld;
  }

  Heating.prototype = Step.prototype;

  Heating.prototype.constructor = Heating;

  return Heating;
});