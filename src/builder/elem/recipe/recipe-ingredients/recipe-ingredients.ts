var Polymer:Function = Polymer || function () {}

class RecipeIngredients {
  data: any;
  groups: any;
  recipe: any;
  
  ready() {}
  
  recipeChanged() {
    console.log(this.recipe);
  }
  
  ingredientsChanged(a, b) {
    b.inventory.forEach(function(item) { this.data.push(item); }, this);
    this.groups.push({
      length: b.inventory.length,
      data: {name: 'Inventory'}
    });
    b.reactors.forEach(function(reactor) {
      reactor.ingredients.forEach(function(item) { this.data.push(item); }, this);
      this.groups.push({
        length: reactor.ingredients.length,
        data: { name: reactor.name }
      });
    }, this);
  }
}

Polymer(RecipeIngredients.prototype);