/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
        bus.suscribe(MessageType.UnsuccessfulConnection, this._onUnsuccessfulConnection, this);
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
        var toast = document.querySelector('#toast1');
        toast.text = "Connected";
        toast.show();
        this._fillInventory();
    };
    RecipeBuilder.prototype._onUnsuccessfulConnection = function () {
        var toast = document.querySelector('#toast1');
        toast.text = "Error : Connection could not be established.";
        toast.show();
    };
    RecipeBuilder.prototype._fillInventory = function () {
        var _this = this;
        this.server.syncInventory()
            .then(function (response) {
            console.debug('Filling inventory with ' + JSON.stringify(response));
            response.items.forEach(function (item) {
                _this.inventory.addItem(Item.fromRaw(item));
            });
            console.log(_this.inventory);
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
