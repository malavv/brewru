define(
['recipe'], 
function(Recipe) {

  function RecipeBuilder() {
    var 
      viewer = document.querySelector('recipe-overview'),
      recipe = new Recipe('TelePorter');

      viewer.recipe = recipe;
  }

  return RecipeBuilder;
});

/*
          var
            store = window.inventory,
            // Water
            water = store.takeQty('anon:0', new Qty(23, Qty.si.l)),
            // Brewer Syrop
            brewerSyrop = store.takeQty('anon:1', new Qty(3.6, Qty.si.kg)),
            // Crystal 120
            crystal120 = store.takeQty('anon:2', new Qty(0.35, Qty.si.kg)),
            // Crystal 60
            crystal60 = store.takeQty('anon:3', new Qty(0.07, Qty.si.kg)),
            // Pale Chocolate
            paleChocolate = store.takeQty('anon:4', new Qty(0.13, Qty.si.kg)),
            // Black Malt
            blackMalt = store.takeQty('anon:5', new Qty(0.07, Qty.si.kg)),
            // Flaked Rye
            flakedRye = store.takeQty('anon:6', new Qty(0.3, Qty.si.kg)),
            // Rolled Oats
            rolledOats = store.takeQty('anon:7', new Qty(0.2, Qty.si.kg)),
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