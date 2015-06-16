var Polymer:Function = Polymer || function () {}

class RecipeTools {
  selected: number;
  ready() {
    this.selected = 0;
  }
  selectedChanged(oldVal, newVal) {
    console.log('Recipe: selectedchanged:', oldVal, newVal);
  }
}

Polymer(RecipeTools.prototype);