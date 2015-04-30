define(
  [
    'base/bus',
    'step',
    'ingredientSrc'
  ],
  function(Bus, Step, IngredientSrc) {

  var id = 0;

  function Reactor(id) {
    var name = 'Anonymous';
  	this.id = id;
    this.src = new IngredientSrc(this.name, this.id);
    this.steps = [
    	new Step('start', 'start')
    ];

    Object.defineProperty(this, 'name', {
      enumerable: false,
      get: function() {
        console.log('[Reactor] get name()');
        return name;
      },
      set: function(newVal) {
        console.log('[Reactor] set name()');
        name = newVal;
        this.src.name = newVal;
      }
    });
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