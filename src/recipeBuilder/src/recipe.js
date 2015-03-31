define(['procedure'], function(Procedure) {

  function Recipe(name) {
    this.name = name;

    this.reactors = [];
    this.composites = [];

    this.procedure = new Procedure(this.reactors, this.composites);
  }

  return Recipe;
});