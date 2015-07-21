/// <reference path="../../../src/defs/polymer/polymer.ts" />
/// <reference path="../../../src/reactor.ts" />
/// <reference path="../../../src/recipe.ts" />
var RecipeTools = (function () {
    function RecipeTools() {
        this.is = 'recipe-tools';
        this.properties = {
            reactor: {
                type: Reactor,
                value: undefined
            },
            recipe: {
                type: Recipe,
                value: undefined
            }
        };
    }
    RecipeTools.prototype.ready = function () {
        this.selected = 0;
    };
    return RecipeTools;
})();
