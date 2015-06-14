var Polymer:Function = Polymer || function () {}

class RecipeIngredients {
  data:Array<Ingredient> ;
  groups: any;
  recipe: any;

  ready() {}

  recipeChanged() {
    console.log(this.recipe);
  }

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

Polymer(RecipeIngredients.prototype);