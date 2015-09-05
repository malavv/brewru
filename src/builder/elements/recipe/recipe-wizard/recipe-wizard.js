/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />
/// <reference path="../../../lib/es6-promise/es6-promise.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="wizardStep.ts" />
/// <reference path="heatingFactory.ts" />
/// <reference path="addIngredientFactory.ts" />
/// <reference path="../../widget/widget-list/widget-list.ts" />
var NativeStrBox = (function () {
    function NativeStrBox(val) {
        this.val = val;
    }
    NativeStrBox.prototype.toString = function () { return this.val; };
    return NativeStrBox;
})();
function boxNativeIfNeeded(data) {
    return typeof (data[0]) === 'string' ? data.map(function (s) { return new NativeStrBox(s); }) : data;
}
function unboxNativeIfNeeded(item) {
    return item instanceof NativeStrBox ? item.val : item;
}
function registerData(result, key, data) {
    result[key] = data;
}
var WizardScreen;
(function (WizardScreen) {
    WizardScreen[WizardScreen["menu"] = 0] = "menu";
    WizardScreen[WizardScreen["text"] = 1] = "text";
    WizardScreen[WizardScreen["ingredient"] = 2] = "ingredient";
    WizardScreen[WizardScreen["quantity"] = 3] = "quantity";
})(WizardScreen || (WizardScreen = {}));
var RecipeWizard = (function (_super) {
    __extends(RecipeWizard, _super);
    function RecipeWizard() {
        _super.apply(this, arguments);
    }
    // Polymer.Base
    RecipeWizard.prototype.ready = function () {
        this.isChoosing = false;
        bus.suscribe(MessageType.CreateStep, this.onCreateStep, this);
    };
    /** Returns a promise asking for text. */
    RecipeWizard.prototype.askText = function (data) {
        this._description = (data === undefined || data.description === undefined) ? "" : data.description;
        this.switchToScreen(WizardScreen.text);
        this.opened = true;
        return new Promise(this._storePromise.bind(this));
    };
    /**
     * Returns a promise asking for an item from a menu.
     *
     * This will auto-wrap native string array.
     */
    RecipeWizard.prototype.askMenu = function (data) {
        // If nothing asked
        if (data === undefined || data.length === 0)
            return Promise.resolve();
        this._menuSelected = undefined;
        this._menuItems = boxNativeIfNeeded(data);
        this.switchToScreen(WizardScreen.menu);
        this.opened = true;
        return new Promise(this._storePromise.bind(this));
    };
    /**
     * Returns a primuse asking for an item's quantity.
     */
    RecipeWizard.prototype.askQuantity = function (config) {
        this._description = config.description;
        this.$.qty.reset();
        this.$.qty.restrictDimensions(config.allowed);
        this._qty = undefined;
        this.switchToScreen(WizardScreen.quantity);
        this.opened = true;
        return new Promise(this._storePromise.bind(this));
    };
    /**
     * Returns a primuse asking for an ingredient.
     */
    RecipeWizard.prototype.askIngredient = function (type) {
        if (type === undefined)
            return Promise.reject(new InvalidStateError());
        this._ingItems = type === Supply.IngType.Dynamic
            ? this.recipe.listDynamicIngredients()
            : this.inventory.stocks.filter(function (i) { return i.type() === type; });
        this.switchToScreen(WizardScreen.ingredient);
        this.opened = true;
        return new Promise(this._storePromise.bind(this));
    };
    /** Ask the user to choose a step type. */
    RecipeWizard.prototype.askStepType = function () {
        return this.askMenu(StepType.All);
    };
    RecipeWizard.prototype.create = function (concept) {
        switch (concept.ref) {
            case StepType.addIngredient.ref:
                return Promise.resolve(new AddIngredientFactory());
            case StepType.heating.ref:
                return Promise.resolve(new HeatingFactory());
            default:
                console.warn('StepFactory<create>');
                return Promise.reject(new UnimplementedError());
        }
    };
    RecipeWizard.prototype.query = function (ingredients, factory) {
        var _this = this;
        return Promise.resolve(factory.next())
            .then(this.processNext.bind(this, factory))
            .then(function () {
            _this.selectedTmpl = 0;
            _this.opened = false;
            return Promise.resolve(factory);
        });
    };
    RecipeWizard.prototype.processNext = function (factory, c) {
        var _this = this;
        return this._askScreen(c)
            .then(registerData.bind(this, factory.data, c.propertyName))
            .then(function () {
            var next = factory.next();
            if (next === undefined)
                return Promise.resolve(factory);
            else
                return _this.processNext(factory, next);
        });
    };
    RecipeWizard.prototype._textChanged = function (newVal, oldVal) {
        var _this = this;
        if (!this.opened || this.selectedTmpl !== 1)
            return;
        if (newVal === undefined)
            return Promise.reject(new InvalidStateError());
        var promise = this.promise;
        this.promise = undefined;
        this.async(function () {
            _this._description = "";
            _this._text = "";
        }, 1);
        promise.resolve(newVal);
    };
    RecipeWizard.prototype._menuSelectedChanged = function (newIdx, oldIdx) {
        var _this = this;
        if (newIdx === undefined)
            return; // When reseting the value.
        var promise = this.promise;
        this.promise = undefined;
        if (!this.opened || this.selectedTmpl !== 0) {
            promise.reject(new InvalidStateError());
            return;
        }
        if (newIdx < 0 || newIdx >= this._menuItems.length) {
            promise.reject(new InvalidStateError());
            return;
        }
        var choice = this._menuItems[newIdx];
        this._menuItems = [];
        this._menuSelected = undefined;
        this.async(function () {
            _this.$$('#menu widget-list').clear();
        }, 1);
        promise.resolve(unboxNativeIfNeeded(choice));
    };
    RecipeWizard.prototype._ingSelectedChanged = function (newIdx, oldIdx) {
        var _this = this;
        if (newIdx === undefined)
            return; // When reseting the value.
        var promise = this.promise;
        this.promise = undefined;
        if (!this.opened || this.selectedTmpl !== 2) {
            promise.reject(new InvalidStateError());
            return;
        }
        if (newIdx < 0 || newIdx >= this._ingItems.length) {
            promise.reject(new InvalidStateError());
            return;
        }
        var choice = this._ingItems[newIdx];
        this._ingItems = [];
        this._ingSelected = undefined;
        this.async(function () {
            _this.$$('#ingredient widget-list').clear();
        }, 1);
        promise.resolve(unboxNativeIfNeeded(choice));
    };
    RecipeWizard.prototype._qtyChanged = function (newVal, oldVal) {
        if (newVal === undefined)
            return; // When reseting the value.
        var promise = this.promise;
        this.promise = undefined;
        if (!this.opened || this.selectedTmpl !== 3) {
            promise.reject(new InvalidStateError());
            return;
        }
        var choice = this._qty;
        this._qty = undefined;
        promise.resolve({
            description: this._description,
            qty: choice
        });
    };
    RecipeWizard.prototype._storePromise = function (resolve, reject) {
        this.promise = {
            resolve: resolve,
            reject: reject
        };
    };
    RecipeWizard.prototype.switchToScreen = function (screen) {
        var screenId = -1;
        switch (screen) {
            case WizardScreen.menu:
                this.selectedTmpl = 0;
                break;
            case WizardScreen.text:
                this.selectedTmpl = 1;
                break;
            case WizardScreen.ingredient:
                this.selectedTmpl = 2;
                break;
            case WizardScreen.quantity:
                this.selectedTmpl = 3;
                break;
            default: console.warn('Unrecognized Screen requested');
        }
    };
    RecipeWizard.prototype._askScreen = function (c) {
        switch (c.wizardPanel) {
            case WizardStep.ingredient:
                return this.askIngredient(c.config);
                break;
            case WizardStep.menu:
                return this.askMenu(c.config);
            case WizardStep.quantity:
                return this.askQuantity(c.config);
            case WizardStep.text:
                return this.askText(c.config);
            default:
                return Promise.reject(new Error('Invalid Wizard Step'));
        }
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
            return _this.query(_this.inventory.stocks, factory);
        })
            .then(function (stepFactory) {
            return stepFactory.build();
        })
            .then(function (step) {
            step.forEach(function (s) {
                bus.publish(MessageType.NewStepCreated, s);
            });
        })
            .catch(function (e) {
            _this.isChoosing = false;
            if (e instanceof CancelError) {
                console.info('Wizard Canceled');
            }
            else {
                console.error("Wizard issue, or Step building failure", e);
            }
        });
    };
    return RecipeWizard;
})(Polymer.DomModule);
window.Polymer(window.Polymer.Base.extend(RecipeWizard.prototype, {
    is: 'recipe-wizard',
    properties: {
        // ----------- Outside  -----------
        inventory: {
            type: Object,
            value: undefined
        },
        recipe: {
            type: Object,
            notify: true
        },
        // ----------- Internal -----------
        // Selects the Wizard Page.
        selectedTmpl: {
            type: Number,
            value: 0
        },
        // Used to describe pages (used in more than one)
        _description: String,
        // Value of the Text Page.
        _text: {
            type: String,
            observer: '_textChanged'
        },
        // Menu
        _menuItems: Array,
        _menuSelected: {
            type: Object,
            observer: '_menuSelectedChanged'
        },
        // Ingredient
        _ingItems: Array,
        _ingSelected: {
            type: Object,
            observer: '_ingSelectedChanged'
        },
        _ingQty: {
            type: Object,
            observer: '_ingQtyChanged'
        },
        _qty: {
            type: Quantity,
            observer: '_qtyChanged'
        }
    },
    behaviors: [
        Polymer.IronOverlayBehavior
    ]
}));
