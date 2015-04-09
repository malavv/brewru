define(
  [
    'base/concept',
    'base/units',
    'base/key',
    'shortcuts',
    'ingredient',
    'inventory',
    'recipe',
    'newStep'
  ],
  function(Concept, Units, Key, Shortcuts, Ingredient, Inventory, Recipe, NewStep) {

  function RecipeBuilder() {
    this.inventory = new Inventory();
    this.recipe = new Recipe();
    this.shortcuts = new Shortcuts();

    initInventory(this.inventory);

    this.shortcuts.add([Key.alt.s], 'NewStep');

    var newStep = new NewStep();
    window.bus.register(newStep, newStep.triggered, 'NewStep');
  }

  function initInventory(inventory) {
    inventory.add(new Ingredient(new Concept('brew:brewersSyrop', 'Brewer\'s Syrup'), 2.4, Units.SI.Mass.kilogram));
    inventory.add(new Ingredient(new Concept('brew:crystal120', 'Crystal 120'), 0.16, Units.SI.Mass.kilogram));
    inventory.add(new Ingredient(new Concept('brew:crystal60', 'Crystal 60'), 0.14, Units.SI.Mass.kilogram));
    inventory.add(new Ingredient(new Concept('brew:PaleChocolate', 'Pale Chocolate'), 0.14, Units.SI.Mass.kilogram));
    inventory.add(new Ingredient(new Concept('brew:BlackMalt', 'Black Malt'), 0.14, Units.SI.Mass.kilogram));
    inventory.add(new Ingredient(new Concept('brew:FlakedRye', 'Flaked Rye'), 0.14, Units.SI.Mass.kilogram));
    inventory.add(new Ingredient(new Concept('brew:RolledOat', 'Rolled Oat'), 0.14, Units.SI.Mass.kilogram));
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