define(['reactor', 'step'], function(Reactor, Step) {

  var id = 0;

  function Recipe(name) {
    this.name = name;
    this.reactors = [
      Reactor.createAnon()
    ];
  }

  Recipe.prototype.addStep = function(step) {
    if (!(step instanceof Step)) {
      console.log('Trying to add a non-step, step.', step);
    }

    switch(step.reactor.use) {
      case Step.reactorUse.create:
        var reactor = Reactor.createAnon(step);
        step.reactor.in.push(reactor);
        step.reactor.out.push(reactor);
        this.reactors.push(reactor);
        break;
      case Step.reactorUse.use:
        step.reactor.in[0].pushStep(step);
        break;
      case Step.reactorUse.merge: break;
      case Step.reactorUse.destroy: break;
      case Step.reactorUse.unknown: break;
    }
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