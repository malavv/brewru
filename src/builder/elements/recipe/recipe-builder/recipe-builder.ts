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

  public defaultRecipe():RecipeImpl {
    var recipe = new RecipeImpl();
    recipe.description = 'APA recipe from xBeeriment';
    recipe.style = Styles.americanIpa;
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