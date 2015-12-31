/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/** Lists all the triggers to which something can be bound. */
var RecipeTriggers = (function (_super) {
    __extends(RecipeTriggers, _super);
    function RecipeTriggers() {
        _super.apply(this, arguments);
    }
    RecipeTriggers.prototype.ready = function () {
        bus.suscribe(MessageType.RecipeChanged, this._recipeChanged, this);
    };
    RecipeTriggers.prototype._recipeChanged = function () {
        console.log('recipe');
        this.set('triggers', this.triggers.slice());
    };
    return RecipeTriggers;
})(Polymer.DomModule);
window.Polymer(window.Polymer.Base.extend(RecipeTriggers.prototype, {
    is: 'recipe-triggers',
    properties: {
        triggers: {
            type: Array,
            notify: true
        }
    }
}));
