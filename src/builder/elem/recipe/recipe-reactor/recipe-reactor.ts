var Polymer:Function = Polymer || function () {}

class RecipeReactor {
  reactor: any;
  
  ready() {}
  
  reactorChanged(oldVal, newVal) {
    console.log('RecipeReactor:reactorChanged', oldVal, newVal);
  }
}

Polymer(RecipeReactor.prototype);