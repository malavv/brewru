/// <reference path="../../../src/reactor.ts" />
/// <reference path="../../../src/recipe.ts" />
var RecipeOverview = (function () {
    function RecipeOverview() {
        this.is = 'recipe-overview';
    }
    RecipeOverview.prototype.recipeChanged = function () {
        this.current = this.recipe.reactors[0];
        console.info('recipe Changed', this.current);
    };
    return RecipeOverview;
})();
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
};
