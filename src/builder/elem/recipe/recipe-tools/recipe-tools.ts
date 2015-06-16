var Polymer:Function = Polymer || function () {}

class RecipeTools {
  selected: number;
  ready() {
    this.selected = 0;
  }
}

Polymer(RecipeTools.prototype);