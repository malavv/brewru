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
    // This is not own by this object but a reference to the ing. depot.
    this.ingredients  = ingredients;
    this.reactors = [];
    this.addReactor(Reactor.createAnon());
  }

  Recipe.prototype.addReactor = function(reactor) {
    if (Reactor.isReactor(reactor)) {
      this.reactors.push(reactor);
      this.ingredients.addSrc(reactor);
    } else {
      console.log("pushed invalid reactor.");
    }
  };

  return Recipe;
});