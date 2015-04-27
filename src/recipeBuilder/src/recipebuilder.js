define(
  [
    'base/bus',
    'base/key',
    'base/units',
    'entities',
    'ingredient',
    'ingredients',
    'recipe',
    'step'
  ],
  function(Bus, Key, Units, Entities, Ingredient, Ingredients, Recipe, Step) {

  function RecipeBuilder() {
    this.ingredients = new Ingredients();
    this.recipe = new Recipe(undefined, this.ingredients);

    // Add fake or basic items
    initInventory(this.ingredients);

    // Fake first item
    this.recipe.reactors[0].steps.push(new Step('Add Water', 'Add Ingredient'));

    window.bus.register(this, 'NewStepCreated');
  }

  RecipeBuilder.prototype.onNewStepCreated = function(a, b, c) {
    this.recipe.reactors[0].steps.push(new Step(a.name, 'Add Ingredient'));
    window.bus.broadcast('RecipeChanged');
    console.log('RecipeBuilder', 'onNewStepCreated', a, b, c);
  };

  function initInventory(ingredients) {
    ingredients.addToInventory(new Ingredient(Entities.syrup, 2.4, Units.SI.Mass.kilogram));
    ingredients.addToInventory(new Ingredient(Entities.c120, 0.16, Units.SI.Mass.kilogram));
    ingredients.addToInventory(new Ingredient(Entities.c60, 0.14, Units.SI.Mass.kilogram));
    ingredients.addToInventory(new Ingredient(Entities.paleChoco, 0.14, Units.SI.Mass.kilogram));
    ingredients.addToInventory(new Ingredient(Entities.blackMalt, 0.14, Units.SI.Mass.kilogram));
    ingredients.addToInventory(new Ingredient(Entities.flakedRye, 0.14, Units.SI.Mass.kilogram));
    ingredients.addToInventory(new Ingredient(Entities.rolledOat, 0.14, Units.SI.Mass.kilogram));
  }

  return RecipeBuilder;
});

/*
          var
            store = window.inventory,
            // Steps
            withWaterStep, heatingStep, addFermentableStep;

          self.recipe = new Recipe('TelePorter');

          withWaterStep = WithWater
            .create('Add Water')
            .addInput(water)
            .build();
          self.recipe.addStep(withWaterStep);

          heatingStep = Heating
            .create('Heat To Boil', withWaterStep.reactor.out[0])
            .build(),
          self.recipe.addStep(heatingStep);

          addFermentableStep = AddFermentable
            .create('Add Fermentables', heatingStep.reactor.out[0])
            .addInput(brewerSyrop)
            .addInput(crystal120)
            .addInput(crystal60)
            .addInput(paleChocolate)
            .addInput(blackMalt)
            .build();
          self.recipe.addStep(addFermentableStep);

          // Traverse the graph
          window.recipe = self.recipe;

          self.steps = self.recipe.reactors[0].getStepList();

*/