define(['reactor'], function(Reactor) {

  function Procedure(reactors, composites) {
  	this.mashing = [];
  	this.boiling = [];
  	this.fermenting = [];
  	this.packaging = [];
    this.reactors = reactors;
    this.composites = composites;
  }

  Procedure.type = {
  	mashing: 0,
  	boiling: 1,
  	fermenting: 2,
  	packaging: 3
  };

  function registerInputIngredient(ingredient) {

  }

  function registerOutputIngredient(ingredient) {
    if (ingredient.type === 'reactor') {
      if (!this.reactors.some(function(reactor) { return reactor.id === ingredient.item; })) {
        this.reactors.push({id: ingredient.item});
      }
    }
  }

  function registerIngredient(ingredient) {
    var key = ingredient.split(':')[0];
    switch (key) {
      case 'reactor':
        if (!this.reactors.some(function(reactor) { return reactor.id === ingredient; })) {
          this.reactors.push({id: ingredient});
        }
        break;
      case 'anon':
        break;
      case 'tmp':
        if (!this.composites.some(function(composite) { return composite.id === ingredient; })) {
          this.composites.push({id: ingredient});
        }
        break;
    }
  }

  Procedure.prototype.addStep = function(step) {
    // Register Inputs
    step.inputs.forEach(registerInputIngredient, this);
    // Register Outputs
    step.outputs.forEach(registerOutputIngredient, this);

    switch (step.type) {
      case Procedure.type.mashing:
        this.mashing.push(step);
        break;
      case Procedure.type.boiling:
        this.boiling.push(step);
        break;
      case Procedure.type.fermenting:
        this.fermenting.push(step);
        break;
      case Procedure.type.packaging:
        this.packaging.push(step);
        break;
    }
  };

  return Procedure;
});