/// <reference path="../../../src/base/polymer.d.ts" />
/// <reference path="../../../src/ingredients.ts" />
/// <reference path="../../../src/ingredient.ts" />

class RecipeIngredients {
  data:Array<Ingredient> ;
  groups: any;
  recipe: any;

  ready() {}

  recipeChanged() {}

  ingredientsChanged(a:Ingredients, b:Ingredients) {
    b.inventory.forEach(item => this.data.push(item));
    this.groups.push({
      length: b.inventory.length,
      data: {name: 'Inventory'}
    });
    b.reactors.forEach(function(reactor:any) {
      reactor.ingredients.forEach(function(item:any) { this.data.push(item); }, this);
      this.groups.push({
        length: reactor.ingredients.length,
        data: { name: reactor.name }
      });
    }, this);
  }
}

if (!Polymer.getRegisteredPrototype('recipe-ingredients')) {
  Polymer('recipe-ingredients', RecipeIngredients.prototype);
}