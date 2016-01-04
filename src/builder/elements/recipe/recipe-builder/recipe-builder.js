/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
;
var RecipeBuilder = (function (_super) {
    __extends(RecipeBuilder, _super);
    function RecipeBuilder() {
        _super.apply(this, arguments);
    }
    RecipeBuilder.prototype.ready = function () {
        this.server = new ServerImpl("ws://localhost:8080/socket");
        this.ingredients = new Ingredients();
        this.recipe = new Recipe();
        bus.suscribe(MessageType.NewStepCreated, this._onNewStepCreated, this);
        window.builder = this;
    };
    RecipeBuilder.prototype.saveRecipe = function () {
        localStorage.setItem('recipe', JSON.stringify(this.recipe));
    };
    RecipeBuilder.prototype.loadRecipe = function () {
        var json = JSON.parse(localStorage.getItem('recipe'));
        var newRecipe = Recipe.decode(json);
        this.recipe = newRecipe;
    };
    RecipeBuilder.prototype._onNewStepCreated = function (config) {
        this.push('recipe.reactors.0.steps', new Step(config.name, config.type));
        bus.publish(MessageType.RecipeChanged);
    };
    return RecipeBuilder;
})(Polymer.DomModule);
window.Polymer(window.Polymer.Base.extend(RecipeBuilder.prototype, {
    is: 'recipe-builder',
    properties: {
        inventory: {
            type: Object,
            notify: true
        },
        ingredients: {
            type: Object,
            notify: true
        },
        recipe: {
            type: Object,
            notify: true
        }
    }
}));
