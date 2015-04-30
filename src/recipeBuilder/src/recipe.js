define([
  'reactor',
  'step'
], function(Reactor, Step) {

  /**
   * Main object describing the new recipe.
   * @constructor
   */
  function Recipe(name, ingredients) {
    this.name = name || 'Anonymous';
    this.reactors = [];

    this.addReactor(Reactor.createAnon());
  }

  Recipe.prototype.addReactor = function(reactor) {
    if (!Reactor.isReactor(reactor)) {
      console.log("[Recipe] Object added is not a reactor");
      return;
    }
    this.reactors.push(reactor);
  };

  return Recipe;
});