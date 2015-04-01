define(
['list'],
function(List) {

	var id = 0;

  function Reactor(id, creator) {
  	this.id = id;
    this.steps = (new List()).push(creator);
  }

  Reactor.createAnon = function(step) {
  	return new Reactor('reactor:' + id++, step);
  };

  Reactor.prototype.pushStep = function(step) {
    this.steps.push(step);
  };

  Reactor.prototype.getStepList = function() {
    var steps = [];
    for (var node = this.steps.begin; node.next !== null; node = node.next) {
      steps.push(node.data);
    }
    steps.push(node.data);
    return steps;
  };

  return Reactor;
});