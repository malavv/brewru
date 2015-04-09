define(
['step'],
function(Step) {

  function AddFermentable(name, inputs, outputs, reactor) {
    Step.call(this, name, inputs, outputs);

    this.reactor.use = Step.reactorUse.use;
    this.reactor.in.push(reactor);
    this.reactor.out.push(reactor);
  }

  AddFermentable.create = function(name, reactor) {
    var
      inputs = [],
      outputs = [],
      bld = {
        addInput: function(input) { inputs.push(input); return bld; },
        addOutput: function(output) { outputs.push(output); return bld; },
        build: function(input) { return new AddFermentable(name, inputs, outputs, reactor); }
      };
    return bld;
  };

  AddFermentable.prototype = Step.prototype;

  AddFermentable.prototype.constructor = AddFermentable;

  return AddFermentable;
});