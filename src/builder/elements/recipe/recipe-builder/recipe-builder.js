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
        var _this = this;
        this.server = new ServerImpl("ws://localhost:8080/socket");
        this.inventory = new Inventory();
        this.ingredients = new Ingredients();
        this.recipe = new Recipe();
        bus.suscribe(MessageType.NewStepCreated, this._onNewStepCreated, this);
        bus.suscribe(MessageType.ServerConnected, function () {
            _this.async(function () {
                _this._onConnectionEstablished();
            });
        }, this);
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
    RecipeBuilder.prototype._onConnectionEstablished = function () {
        this._fillInventory();
    };
    RecipeBuilder.prototype._fillInventory = function () {
        var _this = this;
        this.server.syncInventory()
            .then(function (response) {
            bus.publish(MessageType.StatusUpdate, "Filling inventory with Server data.");
            response.items.forEach(function (item) {
                _this.inventory.addItem(Item.fromRaw(item));
            });
            bus.publish(MessageType.StatusUpdate, "Done");
        })
            .catch(function (error) {
            console.warn('server error : ' + JSON.stringify(error));
        });
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
