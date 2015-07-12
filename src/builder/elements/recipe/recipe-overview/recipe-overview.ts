/// <reference path="../../../src/reactor.ts" />
/// <reference path="../../../src/recipe.ts" />

class RecipeOverview {
  is:string = 'recipe-overview';
  
  current: Reactor;
  recipe: any;
  properties: any;
  
  recipeChanged() {
    this.current = this.recipe.reactors[0];
    console.log('recipe Changed', this.current);
  }
}

RecipeOverview.prototype.is = 'recipe-overview';

RecipeOverview.prototype.properties = {
   recipe: {
     type: Recipe,
     notify: true,
     observer: 'recipeChanged'
   },
   current: {
     type: Reactor
   }
}