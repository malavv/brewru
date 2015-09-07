var OntoRef = (function () {
    function OntoRef(ref, name) {
        this.ref = ref || 'anon:' + OntoRef.nextAnonRef++;
        this.name = name;
        this.isAnon = ref === null;
    }
    OntoRef.prototype.toString = function () { return this.name; };
    OntoRef.createAnon = function (name) { return new OntoRef(null, name); };
    OntoRef.create = function (ref, name) { return new OntoRef(ref, name); };
    OntoRef.nextAnonRef = 0;
    return OntoRef;
})();
/// <reference path="base/conceptRef.ts" />
var Entities = (function () {
    function Entities() {
    }
    Entities.tapWater = new OntoRef('brew:tapWater', 'Tap Water');
    Entities.inventory = new OntoRef('brew:personalInventory', 'Personal Inventory');
    Entities.kg = new OntoRef('unit:kilogram', 'kilogram');
    Entities.liter = new OntoRef('unit:liter', 'liter');
    Entities.syrup = new OntoRef('brew:brewersSyrop', 'Brewer\'s Syrup');
    Entities.dme = new OntoRef('brew:dme', 'Dry Malt Extract');
    Entities.c120 = new OntoRef('brew:crystal120', 'Crystal 120');
    Entities.c60 = new OntoRef('brew:crystal60', 'Crystal 60');
    Entities.paleChoco = new OntoRef('brew:PaleChocolate', 'Pale Chocolate');
    Entities.blackMalt = new OntoRef('brew:BlackMalt', 'Black Malt');
    Entities.flakedRye = new OntoRef('brew:FlakedRye', 'Flaked Rye');
    Entities.rolledOat = new OntoRef('brew:RolledOat', 'Rolled Oat');
    Entities.yeastNutrient = new OntoRef('brew:yeastNutrient', 'Yeast Nutrient');
    Entities.w2112 = new OntoRef('brew:w2112', 'Wyeast California Lager');
    return Entities;
})();
var CancelError = (function () {
    function CancelError() {
        this.name = 'Cancel';
        this.message = 'Operation has been cancelled.';
    }
    return CancelError;
})();
var UnimplementedError = (function () {
    function UnimplementedError() {
        this.name = 'Unimplemented';
        this.message = 'Operation not yet implemented.';
    }
    return UnimplementedError;
})();
var InvalidStateError = (function () {
    function InvalidStateError() {
        this.name = 'InvalidState';
        this.message = 'Invalid state reached.';
    }
    return InvalidStateError;
})();
/**
 * Represents a unit dimension.
 *
 * Whether it is a unit of mass, a unit of length, ...
 */
var Dim = (function () {
    function Dim() {
    }
    Dim.all = function () { return [Dim.Length, Dim.Mass, Dim.Temperature, Dim.Volume]; };
    Dim.Length = new Dim();
    Dim.Mass = new Dim();
    Dim.Temperature = new Dim();
    Dim.Volume = new Dim();
    Dim.Temporal = new Dim();
    return Dim;
})();
/// <reference path="../base/conceptRef.ts" />
/// <reference path="../units/dimension.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Supply;
(function (Supply) {
    var IngType = (function () {
        function IngType(name) {
            this.name = name;
        }
        IngType.all = function () {
            return [
                IngType.Fermentable,
                IngType.Hops,
                IngType.Yeast,
                IngType.Miscellaneous,
                IngType.Dynamic
            ];
        };
        IngType.of = function (name) {
            var found = IngType.all().filter(function (t) { return t.name === name; });
            return found.length === 1 ? found[0] : null;
        };
        IngType.prototype.toString = function () {
            return this.name;
        };
        IngType.Fermentable = new IngType('fermentable');
        IngType.Hops = new IngType('hops');
        IngType.Yeast = new IngType('yeast');
        IngType.Miscellaneous = new IngType('miscellaneous');
        IngType.Dynamic = new IngType('dynamic');
        return IngType;
    })();
    Supply.IngType = IngType;
    /**
     * Represents the abstract concept of certain ingredient.
     *
     * For example, Hallertauer is a base ingredient but Hallertauer (us)
     * from a certain place and having a certain AA is a Ingredient.
     */
    var BaseIng = (function () {
        function BaseIng(concept, type, dimensions) {
            if (dimensions === void 0) { dimensions = []; }
            this.ref = concept;
            this._type = type;
            this._dimensions = dimensions;
        }
        BaseIng.prototype.type = function () { return this._type; };
        BaseIng.prototype.dimensions = function () { return this._dimensions; };
        BaseIng.prototype.toString = function () { return this.ref.name; };
        return BaseIng;
    })();
    Supply.BaseIng = BaseIng;
    /**
     * Represent an ingredient but not its associated supplies.
     */
    var Ing = (function (_super) {
        __extends(Ing, _super);
        function Ing(concept, type, dimensions) {
            if (dimensions === void 0) { dimensions = []; }
            _super.call(this, concept, type, dimensions);
        }
        Ing.prototype.toString = function () { return this.ref.name; };
        return Ing;
    })(BaseIng);
    Supply.Ing = Ing;
})(Supply || (Supply = {}));
/// <reference path="base/conceptRef.ts" />
/// <reference path="supply/ingredient" />
var IngredientSrc = (function () {
    function IngredientSrc(concept) {
        this.concept = concept;
        this.stocks = [];
    }
    IngredientSrc.prototype.addAll = function (items) {
        this.stocks = this.stocks.concat(items);
        return this;
    };
    return IngredientSrc;
})();
/// <reference path="base/conceptRef.ts" />
/** This will need to be reviewed with specific sub-classes. */
var Step = (function () {
    function Step(name, type, id) {
        if (id === void 0) { id = 'anon:' + Step.idx++; }
        this.id = id;
        this.name = name;
        this.type = type;
    }
    Step.prototype.toString = function () {
        return this.name;
    };
    Step.idx = 0;
    return Step;
})();
/**
 * Step type object for easy autocomplete.
 *
 * Should be filled from the ontology and should be used using the Step object.
 */
var StepType = (function () {
    function StepType() {
    }
    StepType.addIngredient = OntoRef.createAnon('Add Ingredient');
    StepType.defineOutput = OntoRef.createAnon('Define Output');
    StepType.ferment = OntoRef.createAnon('Ferment');
    StepType.heating = OntoRef.createAnon('Change of Temp.');
    StepType.merging = OntoRef.createAnon('Merging');
    StepType.splitting = OntoRef.createAnon('Splitting');
    // Should not be in all, since sentinel step.
    StepType.start = OntoRef.createAnon('Start');
    StepType.All = [
        StepType.addIngredient,
        StepType.defineOutput,
        StepType.ferment,
        StepType.heating,
        StepType.merging,
        StepType.splitting
    ];
    return StepType;
})();
/// <reference path="ingredientSrc.ts" />
/// <reference path="step.ts" />
var Reactor = (function () {
    function Reactor(id, name, steps) {
        if (id === void 0) { id = 0; }
        if (name === void 0) { name = 'Anonymous'; }
        if (steps === void 0) { steps = [new Step('start', StepType.start)]; }
        this.id = id;
        this.name = name;
        this.steps = steps;
    }
    Reactor.prototype.addAfter = function (lhs, newObj) {
        if (newObj.timing === 'After') {
            var idx = this.steps.indexOf(lhs);
            this.steps.splice(idx + 1, 0, new Step('Anonymous', null));
        }
    };
    Reactor.createAnon = function () {
        return new Reactor(Reactor.nextIdx);
    };
    Reactor.isReactor = function (reactor) {
        return reactor.id !== undefined
            && reactor.steps !== undefined
            && Array.isArray(reactor.steps);
    };
    Reactor.nextId = function () {
        return 'reactor:' + Reactor.nextIdx++;
    };
    Reactor.nextIdx = 0;
    return Reactor;
})();
/// <reference path="reactor.ts" />
/// <reference path="base/conceptRef.ts" />
/// <reference path="supply/ingredient" />
var Ingredients = (function () {
    function Ingredients() {
        this.inventory = [];
        this.reactors = [];
    }
    Ingredients.prototype.listAllIngredients = function () {
        return [].concat(this.inventory);
    };
    Ingredients.prototype.getFromInventory = function (concept) {
        return this.inventory.filter(function (i) { return i.ref === concept; });
    };
    Ingredients.prototype.addToInventory = function (ingredient) {
        this.inventory.push(ingredient);
    };
    Ingredients.prototype.addSrc = function (reactor) {
        if (this.reactors.some(function (s) { return s.id == reactor.id; }))
            return;
        this.reactors.push(reactor);
    };
    return Ingredients;
})();
/// <reference path="reactor.ts" />
/// <reference path="supply/ingredient.ts" />
/// <reference path="entities.ts" />
var Recipe = (function () {
    function Recipe(name, reactors) {
        if (name === void 0) { name = 'Anonymous'; }
        if (reactors === void 0) { reactors = [Reactor.createAnon()]; }
        this.name = name;
        this.reactors = reactors;
    }
    Recipe.prototype.addReactor = function (reactor) {
        if (!Reactor.isReactor(reactor)) {
            console.log("[Recipe] Object added is not a reactor");
            return;
        }
        this.reactors.push(reactor);
    };
    Recipe.prototype.listDynamicIngredients = function () {
        return [
            new Supply.Ing(Entities.tapWater, null, [Dim.Volume])
        ].concat(this.reactors.reduce(this._getOutput.bind(this), []));
    };
    Recipe.prototype._getOutput = function (last, elem) {
        return last.concat(elem.steps.filter(function (s) { return s.type === StepType.defineOutput; }));
    };
    Recipe.prototype.encode = function () {
        return JSON.stringify(this);
    };
    Recipe.decode = function (o) {
        var name = o['name'];
        var reactors = o['reactors'].map(Recipe._decodeReactor);
        return new Recipe(name, reactors);
    };
    Recipe._decodeReactor = function (o) {
        return new Reactor((o['id']), (o['name']), (o['steps'].map(Recipe._decodeStep)));
    };
    Recipe._decodeStep = function (o) {
        return new Step((o['name']), (o['type']), (o['id']));
    };
    Recipe._decodeRef = function (o) {
        return new OntoRef((o['ref']), (o['name']));
    };
    return Recipe;
})();
var Keyboard = (function () {
    function Keyboard(event) {
        this.event = event;
        this.binding = Keyboard.getKeyBinding(event);
    }
    Keyboard.prototype.toString = function () {
        return this.binding;
    };
    Keyboard.fromEvt = function (event) {
        return new Keyboard(event);
    };
    Keyboard.getKeyBinding = function (event) {
        var binding = [];
        if (event.altKey)
            binding.push('alt');
        if (event.ctrlKey)
            binding.push('ctrl');
        if (event.metaKey)
            binding.push('meta');
        if (event.shiftKey)
            binding.push('shift');
        binding.push(this.getCodeName(event.which));
        return binding.join('+');
    };
    Keyboard.getCodeName = function (code) {
        if (code >= 33 && code <= 126)
            return String.fromCharCode(code);
        switch (code) {
            case 8: return 'backspace';
            case 13: return 'enter';
            case 16: return 'shift'; /** Shift only */
            case 18: return 'shift'; /** Alt   only */
            case 27: return 'esc';
            case 32: return 'space';
            default:
                console.warn('[Keyboard]getCodeName: Unknown Code Name :', code);
                return 'unknwon';
        }
    };
    return Keyboard;
})();
/// <reference path="base/keyboard.ts" />
/**
 * Defines a shortcut with a possible binding.
 *
 * Used to bind a certain key combination with a SubPub message.
 */
var Shortcut = (function () {
    function Shortcut() {
    }
    return Shortcut;
})();
/**
 * Manager of shortcuts, no method is static. Use default for main instance.
 */
var Shortcuts = (function () {
    function Shortcuts() {
        /** List of all bound Shortcuts. */
        this.all = [];
        /** Map of binding to Shortcut. */
        this.map = {};
    }
    Shortcuts.prototype.hasKey = function (key) {
        return this.map[key.toString()] !== undefined;
    };
    Shortcuts.prototype.get = function (key) {
        return this.map[key.toString()];
    };
    /** Chainable method to add a Shortcut to this manager. */
    Shortcuts.prototype.add = function (binding, intent, description) {
        var newShortcut = {
            binding: binding,
            description: description,
            intent: intent
        };
        this.all.push(newShortcut);
        this.map[binding] = newShortcut;
        return this;
    };
    return Shortcuts;
})();
var base;
(function (base_1) {
    /**
     * Provides codes that are easily accessible from  a keyboard.
     *
     * Useful when providing keyboard shortcuts to the user.
     */
    var KeyboardBase = (function () {
        function KeyboardBase() {
        }
        KeyboardBase.prototype.toCode = function (idx) {
            return KeyboardBase.isIdxValid(idx) ? KeyboardBase.codes[idx] : KeyboardBase.errorCode;
        };
        KeyboardBase.prototype.toIdx = function (base) {
            return KeyboardBase.isCodeValid(base) ? KeyboardBase.codes.indexOf(base) : KeyboardBase.errorIdx;
        };
        KeyboardBase.isIdxValid = function (idx) {
            return !isNaN(idx) && !(idx < 0) || !(idx >= KeyboardBase.codes.length);
        };
        KeyboardBase.isCodeValid = function (base) {
            return typeof (base) === 'string' && KeyboardBase.codes.indexOf(base) !== -1;
        };
        KeyboardBase.codes = '0123456789abcdefghijklmnopqrstuvwxyz';
        KeyboardBase.errorCode = '-';
        KeyboardBase.errorIdx = -1;
        return KeyboardBase;
    })();
    base_1.KeyboardBase = KeyboardBase;
})(base || (base = {}));
var MessageType = (function () {
    function MessageType(name, id) {
        this.name = name;
        this.id = id;
    }
    MessageType.unknown = new MessageType('Unknown', 0);
    MessageType.NewStepCreated = new MessageType('NewStepCreated', 1);
    MessageType.RecipeChanged = new MessageType('RecipeChanged', 2);
    MessageType.AskIngredient = new MessageType('AskIngredient', 3);
    MessageType.AnswerIngredient = new MessageType('AnswerIngredient', 4);
    MessageType.ShowShortcuts = new MessageType('ShowShortcuts', 5);
    MessageType.CreateStep = new MessageType('CreateStep', 6);
    MessageType.Cancel = new MessageType('CreateStep', 7);
    MessageType.AskMenu = new MessageType('AskMenu', 8);
    MessageType.AnswerMenu = new MessageType('AnswerMenu', 9);
    MessageType.AskText = new MessageType('AskText', 10);
    MessageType.AnswerText = new MessageType('AnswerText', 11);
    MessageType.AskQuantity = new MessageType('AskQuantity', 12);
    MessageType.AnswerQuantity = new MessageType('AnswerQuantity', 13);
    MessageType.ServerConnected = new MessageType('ServerConnected', 14);
    MessageType.UnsuccessfulConnection = new MessageType('UnsuccessfulConnection', 15);
    MessageType.InventoryChanged = new MessageType('InventoryChanged', 16);
    MessageType.StatusUpdate = new MessageType('StatusUpdate', 17);
    return MessageType;
})();
;
/// <reference path="messageType.ts" />
/// <reference path="../defs/es6-promise/es6-promise.d.ts" />
var Suscriber = (function () {
    function Suscriber() {
    }
    return Suscriber;
})();
var EventBus = (function () {
    function EventBus() {
        this.byType = {};
        /**
         * When true the bus will log all events on the console.
         */
        this.isLogging = false;
    }
    /**
     * Sends an event to all potential suscribers
     * @param type Type of the event from EventType
     * @param data Any relevant data.
     */
    EventBus.prototype.publish = function (type, data) {
        var _this = this;
        (this.byType[type.id] || [])
            .forEach(function (handler) { _this.trigger(handler, data); });
        this.log(type, data);
    };
    /**
     * Suscribe to a type of events.
     * @param handler Object that will handle the message.
     * @param types Types of message to register to.
     */
    EventBus.prototype.suscribe = function (type, callback, optThis) {
        this.byType[type.id] = this.byType[type.id] || [];
        this.byType[type.id].push({
            obj: optThis || Window,
            fn: callback,
            type: type
        });
    };
    /**
     * Publish a message and waits for an answer.
     */
    EventBus.prototype.publishAndWaitFor = function (waitForType, publishType, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.suscribe(waitForType, function (data) { resolve(data); }, _this);
            _this.publish(publishType, data);
        });
    };
    EventBus.prototype.log = function (type, data) {
        if (this.isLogging)
            console.log('[EventBus]', type, data);
    };
    EventBus.prototype.trigger = function (handler, data) {
        handler.fn.call(handler.obj, data);
    };
    return EventBus;
})();
var bus = new EventBus();
/// <reference path="../base/conceptRef.ts" />
/// <reference path="dimension.ts" />
var Unit = (function () {
    function Unit(concept, symbol, offset, multiplier, dim, system) {
        this.concept = concept;
        this.symbol = symbol;
        this.offset = offset;
        this.multiplier = multiplier;
        this.dimension = dim;
        this.system = system;
    }
    Unit.prototype.toString = function () {
        return this.concept + '(' + this.symbol + ')';
    };
    Unit.Unknown = new Unit(OntoRef.createAnon('unknownUnit'), '', 0, 0, undefined, undefined);
    return Unit;
})();
/// <reference path="../units/unit.ts" />
var Quantity = (function () {
    function Quantity(magnitude, unit) {
        this.magnitude = magnitude;
        this.unit = unit;
    }
    Quantity.prototype.toString = function () {
        return this.magnitude + ' ' + this.unit.symbol;
    };
    return Quantity;
})();
var ListNode = (function () {
    function ListNode(payload) {
        this.payload = payload;
        this.next = null;
        this.last = null;
    }
    return ListNode;
})();
var List = (function () {
    function List() {
    }
    List.prototype.push = function (payload) {
        var newNode = new ListNode(payload);
        if (this.end === null) {
            this.begin = newNode;
            this.end = newNode;
            return this;
        }
        this.end.next = newNode;
        newNode.last = this.end;
        this.end = newNode;
    };
    return List;
})();
/// <reference path="../base/eventBus.ts" />
/// <reference path="../base/messageType.ts" />
/// <reference path="../defs/es6-promise/es6-promise.d.ts" />
var ServerImpl = (function () {
    function ServerImpl(endpoint) {
        /** Whether a server is connected. Can be null. */
        this.isConnected = null;
        if (endpoint === undefined)
            return;
        this.url = endpoint;
        this.packetIdCounter = 0;
        this.timeoutMs = 500;
        this.clientId = "uid00001";
        this.ws = new WebSocket(this.url);
        this.communications = {};
        this.ws.onclose = this._onClose.bind(this);
        this.ws.onerror = this._onError.bind(this);
        this.ws.onmessage = this._onMessage.bind(this);
        this.ws.onopen = this._onOpen.bind(this);
    }
    ServerImpl.prototype.endpoint = function () {
        return this.url;
    };
    ServerImpl.prototype.syncInventory = function () {
        var _this = this;
        var packet = {
            type: 'syncInventory',
            data: null,
            id: this.packetIdCounter,
            clientId: this.clientId
        };
        var promise = new Promise(function (resolve) {
            _this.communications[_this.packetIdCounter] = resolve;
        });
        this.packetIdCounter++;
        console.info('server.send', packet);
        this.ws.send(JSON.stringify(packet));
        return Promise.race([
            new Promise(function (_, reject) { setTimeout(reject, _this.timeoutMs); }),
            promise
        ]).then(function (data) {
            return data;
        }).catch(function (error) {
            throw error;
            return null;
        });
    };
    ServerImpl.prototype._onClose = function () {
        if (this.isConnected === null)
            bus.publish(MessageType.UnsuccessfulConnection);
    };
    ServerImpl.prototype._onError = function () {
    };
    ServerImpl.prototype._onMessage = function (msg) {
        try {
            var pkg = JSON.parse(msg.data);
            console.info('server.received', pkg);
            var callback = this.communications[pkg.id];
            if (callback !== undefined) {
                callback(pkg.data);
            }
        }
        catch (err) {
            console.warn('Error parsing ' + err.message);
        }
    };
    ServerImpl.prototype._onOpen = function () {
        bus.publish(MessageType.ServerConnected);
    };
    return ServerImpl;
})();
var ItemType;
(function (ItemType) {
    ItemType[ItemType["Fermentables"] = 0] = "Fermentables";
    ItemType[ItemType["Hops"] = 1] = "Hops";
    ItemType[ItemType["Yeasts"] = 2] = "Yeasts";
    ItemType[ItemType["Miscellaneous"] = 3] = "Miscellaneous";
    ItemType[ItemType["Dynamics"] = 4] = "Dynamics";
})(ItemType || (ItemType = {}));
;
/// <reference path="item.ts" />
var Stock = (function () {
    function Stock() {
    }
    Stock.fromRaw = function (item, raw) {
        var s = new Stock();
        s.item = item;
        s.quantity = raw.quantity;
        s.boughtOn = new Date(raw.boughtOn);
        s.provider = raw.provider;
        return s;
    };
    return Stock;
})();
/// <reference path="../base/conceptRef.ts" />
/// <reference path="../units/dimension.ts" />
/// <reference path="itemType.ts" />
/// <reference path="stock.ts" />
var Item = (function () {
    function Item() {
    }
    Item.fromRaw = function (raw) {
        var i = new Item();
        switch (raw.type) {
            case 'Fermentables':
                i.type = ItemType.Fermentables;
                break;
            case 'Hops':
                i.type = ItemType.Hops;
                break;
            case 'Yeasts':
                i.type = ItemType.Yeasts;
                break;
            case 'Miscellaneous':
                i.type = ItemType.Miscellaneous;
                break;
            case 'Dynamics':
                i.type = ItemType.Dynamics;
                break;
        }
        i.name = raw.name;
        i.ref = raw.ref;
        i.stocks = raw.stocks.map(function (s) { return Stock.fromRaw(i, s); });
        return i;
    };
    return Item;
})();
/// <reference path="item.ts" />
/// <reference path="itemType.ts" />
/// <reference path="../base/eventBus.ts" />
/**
 * The inventory is a collection of items having types and which can be part of stocks.
 *
 * Fermentables, for examples, is a type of items. A certain quantity of an item, purchased
 * at a certain time, from a certain supplier is a stock.
 */
var Inventory = (function () {
    function Inventory() {
        this.items = [];
        this.stocks = [];
    }
    Inventory.prototype.listItem = function (type) {
        return this.items.filter(function (i) { return i.type === type; });
    };
    Inventory.prototype.addItem = function (item) {
        var _this = this;
        this.items.push(item);
        item.stocks.forEach(function (s) { _this.stocks.push(s); });
        bus.publish(MessageType.InventoryChanged);
    };
    return Inventory;
})();
/// <reference path="dimension.ts" />
/// <reference path="unit.ts" />
/// <reference path="../base/conceptRef.ts" />
var SystemImpl = (function () {
    function SystemImpl(name, units) {
        var _this = this;
        this.units = [];
        this.name = name;
        this.units = units;
        this.units.forEach(function (u) { u.system = _this; });
        return this;
    }
    SystemImpl.prototype.sym = function (symbol) {
        return this.units.filter(function (u) { return u.symbol === symbol; })[0];
    };
    SystemImpl.prototype.dim = function (dim) {
        return this.units.filter(function (u) { return u.dimension === dim; });
    };
    SystemImpl.prototype.getById = function (id) {
        var match = this.units.filter(function (u) { return u.concept.ref === id; });
        return match.length === 0 ? null : match[0];
    };
    return SystemImpl;
})();
var UnitSystem = (function () {
    function UnitSystem() {
    }
    UnitSystem.all = function () { return [this.SI, this.UsCust, this.Imperial]; };
    UnitSystem.getUnit = function (id) {
        var match = this.all()
            .map(function (system, idx, arr) {
            return system.getById(id);
        })
            .filter(function (unit) {
            return unit !== null;
        });
        return match.length === 0 ? null : match[0];
    };
    UnitSystem.SI = new SystemImpl('SI', [
        new Unit(new OntoRef('brew:kg', 'kilogram'), 'kg', 0, 1, Dim.Mass, null),
        new Unit(new OntoRef('brew:liter', 'liter'), 'l', 0, 1, Dim.Volume, null),
        new Unit(new OntoRef('brew:kelvin', 'kelvin'), 'K', 0, 1, Dim.Temperature, null),
        new Unit(new OntoRef('brew:celsius', 'celsius'), 'C', 0, 1, Dim.Temperature, null),
        new Unit(new OntoRef('brew:minute', 'minute'), 'min', 0, 1, Dim.Temporal, null)
    ]);
    UnitSystem.UsCust = new SystemImpl('Us Cust.', [
        new Unit(new OntoRef('brew:inch', 'inch'), 'in', 0, 1, Dim.Length, null),
        new Unit(new OntoRef('brew:pint', 'pint'), 'pt', 0, 1, Dim.Volume, null),
        new Unit(new OntoRef('brew:cup', 'cup'), 'cup', 0, 1, Dim.Volume, null),
        new Unit(new OntoRef('brew:tsp', 'teaspoon'), 'tsp', 0, 1, Dim.Volume, null),
        new Unit(new OntoRef('brew:farenheit', 'farenheit'), 'F', 0, 1, Dim.Temperature, null)
    ]);
    UnitSystem.Imperial = new SystemImpl('Imperial', []);
    return UnitSystem;
})();
var SI = UnitSystem.SI, UsCust = UnitSystem.UsCust, Imperial = UnitSystem.Imperial;
