define(['underscore'], function(_) {

  function Step(name, type) {
    this.name = name;
    this.id = 'anon:0';
    this.type = type;
  }

  Step.prototype.toString = function() {
    return _.template('{{constructor.name}}<{{reactor.use}}>[{{inputs.length}}->{{name}}({{id}})->{{outputs.length}}]')(this);
  };

  return Step;
});