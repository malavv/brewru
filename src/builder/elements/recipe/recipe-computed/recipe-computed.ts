/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class RecipeComputed extends Polymer.DomModule {
  private recipe: Recipe;
  private server: Server;
  private data: Object;

  ready() {
    bus.suscribe(MessageType.ServerConnected, s => this.onServerLoaded(s), null);
  }

  public computeRecipe() {
    Log.info('RecipeComputed', 'Sending Request for computation');
    this.server.compute(this.recipe).then(data => {
      Log.info('RecipeComputed', 'Updating recipe data');
      this.set('data', JSON.stringify(data));
    })
  }

  public onServerLoaded(server : Server) { this.server = server; }
}

window.Polymer(window.Polymer.Base.extend(RecipeComputed.prototype, {
  is: 'recipe-computed',

  observers: [
    'computeRecipe(recipe.*)'
  ],

  properties: {
    recipe: Object,
    data: Object
  }
}));