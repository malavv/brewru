/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

interface Window { builder: any; }

class RecipeBuilder extends Polymer.DomModule {
  inventory: Inventory;
  ingredients: Ingredients;
  recipe: Recipe;
  server: Server;

  ready() {
    this.server = new ServerImpl("ws://localhost:8025/socket");
    this.ingredients = new Ingredients();

    bus.suscribe(MessageType.ServerConnected, server => this.init(server), this);
    bus.suscribe(MessageType.RecipeSelected, recipe => this.set('recipe', recipe), this);

    window.builder = this;
  }

  public init(server : Server) {
    Promise.all([
      Equipments.onServerLoaded(server),
      Units.initialize(server),
      Styles.onServerLoaded(server)
    ]).then(() => {
      bus.publish(MessageType.EquipmentsLoaded);
      bus.publish(MessageType.StylesLoaded);
    })
  }

  public saveRecipe() {
    //localStorage.setItem('recipe', JSON.stringify(this.recipe));
  }

  public loadRecipe() {
    //var json = JSON.parse(localStorage.getItem('recipe'));
    //this.recipe = Recipe.decode(json);
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
