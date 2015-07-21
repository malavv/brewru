/// <reference path="../../../src/defs/polymer/polymer.ts" />
/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/base/messageType.ts" />
/// <reference path="../../../src/base/quantity.ts" />
/// <reference path="../../../src/ingredients.ts" />
/// <reference path="../../../src/errors.ts" />
/// <reference path="../../../src/recipe.ts" />
var AppIngredient = (function () {
    function AppIngredient() {
        this.is = 'app-ingredient';
        this.properties = {
            ingredientSrc: { type: IngredientSrc, value: undefined },
            recipe: { type: Recipe, value: undefined }
        };
    }
    AppIngredient.prototype.ready = function () {
        // Wizard for the selection of ingredient.
        bus.suscribe(MessageType.AskIngredient, this.initAndShow, this);
        // Cancel shuts down gracefully the wizard.
        bus.suscribe(MessageType.Cancel, this.cancel, this);
        this.reset();
    };
    AppIngredient.prototype.cancel = function () {
        if (this.$.overlay.opened)
            this.$.overlay.close();
        bus.publish(MessageType.AnswerIngredient, { ingredient: null, quantity: null });
    };
    AppIngredient.prototype.initAndShow = function (type) {
        this.reset();
        if (type === IngredientType.Dynamic) {
            this.ingredients = this.properties.recipe.listDynamicIngredients();
        }
        else {
            this.ingredients = this.properties.ingredientSrc.stocks.filter(function (i) { return i.type === type; });
        }
        this.$.quan.reset();
        this.$.overlay.open();
    };
    AppIngredient.prototype.ingredientChanged = function () { this.onStateChanged(); };
    AppIngredient.prototype.quantityChanged = function () { this.onStateChanged(); };
    AppIngredient.prototype.onStateChanged = function () {
        if (this.ingredient === undefined)
            return;
        if (this.quantity === undefined)
            return;
        bus.publish(MessageType.AnswerIngredient, {
            ingredient: this.ingredient,
            quantity: this.quantity
        });
        this.$.overlay.close();
    };
    AppIngredient.prototype.reset = function () {
        this.ingredients = [];
        this.ingredient = undefined;
        this.quantity = undefined;
    };
    return AppIngredient;
})();
