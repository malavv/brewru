/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

interface Window { builder: any;
}

class RecipeBuilder extends Polymer.DomModule {
  inventory: Inventory;
  ingredients: Ingredients;
  recipe: Recipe;
  server: Server;

  ready() {
    this.server = new ServerImpl("ws://localhost:8025/socket");
    this.ingredients = new Ingredients();

    this.set('recipe', this.defaultRecipe());

    bus.suscribe(MessageType.NewStepCreated, this._onNewStepCreated, this);
    window.builder = this;
  }

  public defaultRecipe() : RecipeImpl {
    var recipe = new RecipeImpl();
    recipe.description = 'APA recipe from xBeeriment';
    recipe.style = Styles.americanIpa;
    recipe.addStep(new EquipmentStep("6 Gal Kettle"));
    recipe.addStep(new IngredientStep("Add water", "Tap Water", "23 L"));

    var bringToBoil:HeatingStep[] = HeatingStep.create("Bring to a boil");
    recipe.addStep(bringToBoil[0]);
    recipe.addStep(bringToBoil[1]);

    recipe.addStep(new IngredientStep("Add LME", "LME - Clear", "1 kg"));
    recipe.addStep(new IngredientStep("Add DME", "DME - Clear", "1 kg"));

    var keepHeating:HeatingStep[] = HeatingStep.create("60 min @100c");
    recipe.addStep(keepHeating[0]);
    recipe.addStep(new IngredientStep("Hop Addition", "Columbus", "50g"));
    recipe.addStep(new HeatingStep("Middle (" + keepHeating[0].name + ")", keepHeating[0].groupId));
    recipe.addStep(new IngredientStep("Hop Addition", "Columbus", "50g"));
    recipe.addStep(keepHeating[1]);
    recipe.addStep(new IngredientStep("Hop Addition", "Columbus", "50g"));

    var cool:CoolingStep[] = CoolingStep.create("Cool to 22c");
    recipe.addStep(cool[0]);
    recipe.addStep(cool[1]);

    recipe.addStep(new EquipmentStep("Transfer to bottling bucket"));
    recipe.addStep(new MiscStep("Decantation"));
    recipe.addStep(new MiscStep("Mod. Aeration"));
    recipe.addStep(new IngredientStep("Add Yeast", "Safale US-05", "1u"));
    recipe.addStep(new EquipmentStep("Transfert to 5 gal ferm."));

    var ferm:FermentationStep[] = FermentationStep.create("1st Fermentation");
    recipe.addStep(ferm[0]);
    recipe.addStep(new IngredientStep("Hop Addition", "Columbus", "50g"));
    recipe.addStep(ferm[1]);

    recipe.addStep(new EquipmentStep("Transfer Tourie"));
    recipe.addStep(new MiscStep("Decantation Filtering"));

    var ferm2:FermentationStep[] = FermentationStep.create("1st Fermentation");
    recipe.addStep(ferm2[0]);
    recipe.addStep(ferm2[1]);
    recipe.addStep(new MiscStep("Decantation Filtering"));
    recipe.addStep(new IngredientStep("Priming Sugar", "Table Sugar", "50g"));

    recipe.addStep(new EquipmentStep("Bottling"));



    return recipe;
  }

  public saveRecipe() {
    localStorage.setItem('recipe', JSON.stringify(this.recipe));
  }

  public loadRecipe() {
    var json = JSON.parse(localStorage.getItem('recipe'));
    this.recipe = Recipe.decode(json);
  }

  private _onNewStepCreated(config: {name:string; type:ConceptRef}) {
    this.push('recipe.reactors.0.steps', new Step(config.name, config.type));
    bus.publish(MessageType.RecipeChanged);
  }
}

window.Polymer(window.Polymer.Base.extend(RecipeBuilder.prototype, {
  is: 'recipe-builder',
  properties: {
    inventory: {
      type: Object,
      notify: true
    },
	  ingredients: {
      type: Object,
      notify: true
    },
	  recipe: {
      type: Object,
      notify: true
    }
  }
}));