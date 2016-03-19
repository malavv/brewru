/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class RecipeComputed extends Polymer.DomModule {
  private recipe: Recipe;
  private server: Server;

  ready() {
    bus.suscribe(MessageType.ServerConnected, s => this.onServerLoaded(s), null);
  }

  public jsonify() {
    return JSON.stringify(this.recipe.data, undefined, 2);
  }

  public computeRecipe() {
    Log.info('RecipeComputed', 'Sending Request for computation');
    this.server.compute(this.recipe);
  }

  public onServerLoaded(server : Server) { this.server = server; }
}

window.Polymer(window.Polymer.Base.extend(RecipeComputed.prototype, {
  is: 'recipe-computed',

  observers: [
    'computeRecipe(recipe.*)'
  ],

  properties: {
    recipe: Object
  }
}));