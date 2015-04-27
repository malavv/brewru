define(
  [
    'step'
  ],
  function(Step) {

  var id = 0;

  function Reactor(id) {
  	this.id = id;
    this.name = 'Anonymous';
    this.steps = [
    	new Step('start', null, null)
    ];
  }

  Reactor.prototype.addAfter = function(lhs, newObj) {
    if (newObj.timing === 'After') {
      var idx = this.steps.indexOf(lhs);
      this.steps.splice(idx + 1, 0, new Step('Anonymous', null, null));
    }
  };

  return {
    createAnon: function() {
      return new Reactor('reactor:' + id++);
    },
    isReactor: function(o) {
      return o.id !== undefined && o.name !== undefined && o.steps !== undefined && Array.isArray(o.steps);
    }
  };
});