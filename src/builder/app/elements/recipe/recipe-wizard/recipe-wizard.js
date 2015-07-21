/// <reference path="../../../src/defs/es6-promise/es6-promise.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../../src/defs/polymer/polymer.ts" />
/// <reference path="../../../src/base/conceptRef.ts" />
/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/base/quantity.ts" />
/// <reference path="../../../src/errors.ts" />
/// <reference path="../../../src/recipeBuilder.ts" />
/// <reference path="wizardStep.ts" />
/// <reference path="heatingFactory.ts" />
/// <reference path="addIngredientFactory.ts" />
var RecipeWizard = (function (_super) {
    __extends(RecipeWizard, _super);
    function RecipeWizard() {
        _super.apply(this, arguments);
    }
    RecipeWizard.prototype.ready = function () {
        this.isChoosing = false;
        bus.suscribe(MessageType.CreateStep, this.onCreateStep, this);
    };
    RecipeWizard.prototype.onCreateStep = function (data) {
        var _this = this;
        if (this.isChoosing)
            return;
        this.askStepType()
            .then(function (ref) {
            return _this.create(ref);
        })
            .then(function (factory) {
            return _this.query(_this.builder.inventory.stocks, factory);
        })
            .then(function (stepFactory) {
            return stepFactory.build();
        })
            .then(function (step) {
            step.forEach(function (s) {
                bus.publish(MessageType.NewStepCreated, s);
            });
        }).catch(function (e) {
            _this.isChoosing = false;
            if (e instanceof CancelError) {
                console.info('Wizard Canceled');
            }
            else {
                console.error("Wizard issue, or Step building failure", e);
            }
        });
    };
    /** Ask the user to choose a step type. */
    RecipeWizard.prototype.askStepType = function () {
        return this.askMenu(StepType.All);
    };
    RecipeWizard.prototype.create = function (ref) {
        switch (ref.id) {
            case StepType.addIngredient.id:
                return Promise.resolve(new AddIngredientFactory());
            case StepType.heating.id:
                return Promise.resolve(new HeatingFactory());
            default:
                console.warn('StepFactory<create>');
                return Promise.reject(new UnimplementedError());
        }
    };
    RecipeWizard.askText = function (data) {
        return bus.publishAndWaitFor(MessageType.AnswerText, MessageType.AskText, data)
            .then(RecipeWizard.isTextChoiceValid);
    };
    RecipeWizard.prototype.askMenu = function (data) {
        if (data === undefined)
            return undefined;
        if (data.length === 0)
            return Promise.resolve();
        if (typeof (data[0]) === 'string')
            data = RecipeWizard.wrap(data);
        // Feed items to menu
        this.menuitems = data;
        // Select menu
        this.selectedTmpl = 0;
        // Show Wizard.
        this.opened = true;
        return new Promise(function () { });
        //return bus.publishAndWaitFor(MessageType.AnswerMenu, MessageType.AskMenu, data).then(RecipeWizard.isMenuChoiceValid);
    };
    RecipeWizard.askIngredient = function (type) {
        return bus.publishAndWaitFor(MessageType.AnswerIngredient, MessageType.AskIngredient, type)
            .then(RecipeWizard.isIngredientChoiceValid);
    };
    RecipeWizard.askQuantity = function (config) {
        return bus.publishAndWaitFor(MessageType.AnswerQuantity, MessageType.AskQuantity, config)
            .then(RecipeWizard.isQuantityChoiceValid);
    };
    RecipeWizard.isQuantityChoiceValid = function (data) {
        return data.qty !== undefined ? Promise.resolve(data.qty) : Promise.reject('');
    };
    RecipeWizard.isIngredientChoiceValid = function (data) {
        return (data.ingredient !== null && data.quantity !== null) ? Promise.resolve(data) : Promise.reject(new CancelError());
    };
    RecipeWizard.isTextChoiceValid = function (result) {
        return result.value !== undefined ? Promise.resolve(result.value) : Promise.reject(new CancelError());
    };
    RecipeWizard.isMenuChoiceValid = function (type) {
        return type !== undefined ? Promise.resolve(type) : Promise.reject(new CancelError());
    };
    RecipeWizard.wrap = function (data) {
        return data.map(function (s) { return new AppMenuWrapper(s); });
    };
    RecipeWizard.prototype.query = function (ingredients, factory) {
        return Promise.resolve(factory.next())
            .then(RecipeWizard.processNext.bind(this, factory))
            .then(function () {
            return Promise.resolve(factory);
        });
    };
    RecipeWizard.processNext = function (factory, c) {
        console.log('RecipeWizard Heavy Mod warning');
        return Promise.resolve();
        // return c.wizardScreen(c.config)
        //     .then(RecipeWizard.registerData.bind(this, factory.data, c.propertyName))
        //     .then(() => {
        //       var next:WizardConfig = factory.next();
        //       if (next === undefined) return Promise.resolve(factory);
        //       else return RecipeWizard.processNext(factory, next);
        //     });
    };
    RecipeWizard.registerData = function (result, key, data) {
        result[key] = data;
    };
    return RecipeWizard;
})(Polymer.DomModule);
RecipeWizard.prototype.is = 'recipe-wizard';
RecipeWizard.prototype.properties = {
    builder: {
        type: RecipeBuilder,
        value: undefined
    },
    // Menu
    menuitems: Array,
    menuselection: Object,
    selectedTmpl: {
        type: Number,
        value: 0
    }
};
RecipeWizard.prototype.behaviors = [
    Polymer.IronOverlayBehavior
];
