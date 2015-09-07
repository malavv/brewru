/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

interface Window { builder: any; };
interface PaperToast {
  text: string;
  show: () => void;
}

class RecipeBuilder extends Polymer.DomModule {
  inventory: Inventory;
  ingredients: Ingredients;
  recipe: Recipe;
  server: Server;

  ready() {
    this.server = new ServerImpl("ws://localhost:8080/socket");
    this.inventory = new Inventory();
	  this.ingredients = new Ingredients();
	  this.recipe = new Recipe();

	  bus.suscribe(MessageType.NewStepCreated, this._onNewStepCreated, this);
    bus.suscribe(MessageType.ServerConnected, () => {
      this.async(() => {
          this._onConnectionEstablished();
      });
    }, this);

    window.builder = this;
  }

  public saveRecipe() {
    localStorage.setItem('recipe', JSON.stringify(this.recipe));
  }

  public loadRecipe() {
    var json = JSON.parse(localStorage.getItem('recipe'));
    var newRecipe = Recipe.decode(json);
    this.recipe = newRecipe;
  }

  private _onNewStepCreated(config: {name:string; type:ConceptRef}) {
    this.push('recipe.reactors.0.steps', new Step(config.name, config.type));
    bus.publish(MessageType.RecipeChanged);
  }

  private _onConnectionEstablished() {
    this._fillInventory();
  }

  private _fillInventory() {
    this.server.syncInventory()
      .then((response) => {
        bus.publish(MessageType.StatusUpdate, "Filling inventory with Server data.");
        console.debug('Filling inventory with ' + JSON.stringify(response));
        response.items.forEach((item) => {
          this.inventory.addItem(Item.fromRaw(item));
        });
        console.log(this.inventory);
        bus.publish(MessageType.StatusUpdate, "Done");
      })
      .catch((error) => {
        console.warn('server error : ' + JSON.stringify(error));
      });
  }

 //  private _fetchInventory() : IngredientSrc {
 //    var src = new IngredientSrc(Entities.inventory);

	// return src.addAll([
	//   new Supply.Ing(Entities.syrup, Supply.IngType.Fermentable, [Dim.Volume]),
 //    new Supply.Ing(Entities.dme, Supply.IngType.Fermentable, [Dim.Volume]),
	//   new Supply.Ing(Entities.c120, Supply.IngType.Fermentable, [Dim.Mass]),
	//   new Supply.Ing(Entities.c60, Supply.IngType.Fermentable, [Dim.Mass]),
	//   new Supply.Ing(Entities.paleChoco, Supply.IngType.Fermentable, [Dim.Mass]),
	//   new Supply.Ing(Entities.blackMalt, Supply.IngType.Fermentable, [Dim.Mass]),
	//   new Supply.Ing(Entities.flakedRye, Supply.IngType.Fermentable, [Dim.Mass]),
	//   new Supply.Ing(Entities.rolledOat, Supply.IngType.Fermentable, [Dim.Mass]),
	//   new Supply.Ing(Entities.yeastNutrient, Supply.IngType.Miscellaneous, [Dim.Volume]),
	//   new Supply.Ing(Entities.w2112, Supply.IngType.Yeast),
	// ]);
 //  }


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