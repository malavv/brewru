define(['underscore'], function(_) {

  function Step(name, inputs, outputs) {
    this.name = name;
    this.id = 'anon:0';
    this.reactor = {
      use: Step.reactorUse.unknown,
      in: [],
      out: []
    };

    this.inputs = inputs;
    this.outputs = outputs;
  }

  Step.reactorUse = {
    create:  0,
    use:     1,
    merge:   2,
    destroy: 3,
    unknown: 4
  };

  Step.prototype.toString = function() {
    return _.template('{{constructor.name}}<{{reactor.use}}>[{{inputs.length}}->{{name}}({{id}})->{{outputs.length}}]')(this);
  };

  return Step;
});