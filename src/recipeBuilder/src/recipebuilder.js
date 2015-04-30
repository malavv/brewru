define(
  [
    'base/bus',
    'base/key',
    'base/quantity',
    'base/units',
    'entities',
    'ingredient',
    'ingredientSrc',
    'ingredientMngr',
    'recipe',
    'step'
  ],
  function(Bus, Key, Qty, Units, Entities, Ingredient, IngredientSrc, Ingredients, Recipe, Step) {

  function RecipeBuilder() {
    this.inventory = this.fetchInventory();
    this.ingredients = new Ingredients();
    this.recipe = new Recipe(undefined, this.ingredients);

    // Fake first item
    this.recipe.reactors[0].steps.push(new Step('Add Water', 'Add Ingredient'));

    window.bus.register(this, 'NewStepCreated');
  }

  RecipeBuilder.prototype.onNewStepCreated = function(a, b, c) {
    this.recipe.reactors[0].steps.push(new Step(a.name, 'Add Ingredient'));
    window.bus.broadcast('RecipeChanged');
    console.log('RecipeBuilder', 'onNewStepCreated', a, b, c);
  };

  RecipeBuilder.prototype.fetchInventory = function() {
    return (new IngredientSrc('Inventory', Entities.inventory)).addAll([
      new Ingredient(Entities.tapWater, new Qty(Infinity, Units.SI.Volume.liter)),
      new Ingredient(Entities.syrup, new Qty(2.4, Units.SI.Mass.kilogram)),
      new Ingredient(Entities.syrup, new Qty(2.4, Units.SI.Mass.kilogram)),
      new Ingredient(Entities.c120, new Qty(0.16, Units.SI.Mass.kilogram)),
      new Ingredient(Entities.c60, new Qty(0.14, Units.SI.Mass.kilogram)),
      new Ingredient(Entities.paleChoco, new Qty(0.14, Units.SI.Mass.kilogram)),
      new Ingredient(Entities.blackMalt, new Qty(0.14, Units.SI.Mass.kilogram)),
      new Ingredient(Entities.flakedRye, new Qty(0.14, Units.SI.Mass.kilogram)),
      new Ingredient(Entities.rolledOat, new Qty(0.14, Units.SI.Mass.kilogram))
    ]);
  };

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