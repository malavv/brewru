define(
  [
    'base/key',
    'base/units',
    'entities',
    'ingredient',
    'inventory',
    'recipe'
  ],
  function(Key, Units, Entities, Ingredient, Inventory, Recipe) {

  function RecipeBuilder() {
    this.inventory = new Inventory();
    this.recipe = new Recipe();

    // Add fake or basic items
    initInventory(this.inventory);

    // Test new step
    window.bus.broadcast('AskMenu', [
      {name: 'Add Ingredient'},
      {name: 'Heating'},
      {name: 'Splitting'},
      {name: 'Merging'},
      {name: 'Create Ingredient'},
      {name: 'Ferment'}
    ]);

    var stepHandler = {
      call: function(data) {
        console.log('Test back from menu, answer :', data);
      }
    };

    window.bus.register(stepHandler, stepHandler.call, 'AnswerMenu');
  }

  function initInventory(inventory) {
    inventory.add(new Ingredient(Entities.syrup, 2.4, Units.SI.Mass.kilogram));
    inventory.add(new Ingredient(Entities.c120, 0.16, Units.SI.Mass.kilogram));
    inventory.add(new Ingredient(Entities.c60, 0.14, Units.SI.Mass.kilogram));
    inventory.add(new Ingredient(Entities.paleChoco, 0.14, Units.SI.Mass.kilogram));
    inventory.add(new Ingredient(Entities.blackMalt, 0.14, Units.SI.Mass.kilogram));
    inventory.add(new Ingredient(Entities.flakedRye, 0.14, Units.SI.Mass.kilogram));
    inventory.add(new Ingredient(Entities.rolledOat, 0.14, Units.SI.Mass.kilogram));
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