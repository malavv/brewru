define(
  [
    'reactor',
    'step'
  ],
  function(Reactor, Step) {

  function Recipe(name) {
    this.name = name || 'Anonymous';
    this.reactors = [
      Reactor.createAnon()
    ];
  }

  Recipe.prototype.addReactor = function(reactor) {
    if (!(reactor instanceof Reactor)) {
      this.reactors.push(reactor);
    } else {
      console.log("pushed invalid reactor.");
    }
  };

  return Recipe;
});