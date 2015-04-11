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

  return {
    createAnon: function() {
      return new Reactor('reactor:' + id++);
    }
  };
});