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
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
        try {
            this.ws = new WebSocket(this.url);
        }
        catch (e) {
            console.log('error', e);
        }
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
        if (type === undefined)
            return this.items;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UvY29uY2VwdFJlZi50cyIsImVudGl0aWVzLnRzIiwiZXJyb3JzLnRzIiwidW5pdHMvZGltZW5zaW9uLnRzIiwic3VwcGx5L2luZ3JlZGllbnQudHMiLCJpbmdyZWRpZW50U3JjLnRzIiwic3RlcC50cyIsInJlYWN0b3IudHMiLCJpbmdyZWRpZW50cy50cyIsInJlY2lwZS50cyIsImJhc2Uva2V5Ym9hcmQudHMiLCJzaG9ydGN1dHMudHMiLCJiYXNlL2NvZGVzLnRzIiwiYmFzZS9tZXNzYWdlVHlwZS50cyIsImJhc2UvZXZlbnRCdXMudHMiLCJ1bml0cy91bml0LnRzIiwiYmFzZS9xdWFudGl0eS50cyIsImNvbGxlYy9saXN0LnRzIiwic2VydmVyL3NlcnZlci50cyIsInN1cHBseS9pdGVtVHlwZS50cyIsInN1cHBseS9zdG9jay50cyIsInN1cHBseS9pdGVtLnRzIiwic3VwcGx5L2ludmVudG9yeS50cyIsInVuaXRzL3N5c3RlbS50cyJdLCJuYW1lcyI6WyJPbnRvUmVmIiwiT250b1JlZi5jb25zdHJ1Y3RvciIsIk9udG9SZWYudG9TdHJpbmciLCJPbnRvUmVmLmNyZWF0ZUFub24iLCJPbnRvUmVmLmNyZWF0ZSIsIkVudGl0aWVzIiwiRW50aXRpZXMuY29uc3RydWN0b3IiLCJDYW5jZWxFcnJvciIsIkNhbmNlbEVycm9yLmNvbnN0cnVjdG9yIiwiVW5pbXBsZW1lbnRlZEVycm9yIiwiVW5pbXBsZW1lbnRlZEVycm9yLmNvbnN0cnVjdG9yIiwiSW52YWxpZFN0YXRlRXJyb3IiLCJJbnZhbGlkU3RhdGVFcnJvci5jb25zdHJ1Y3RvciIsIkRpbSIsIkRpbS5jb25zdHJ1Y3RvciIsIkRpbS5hbGwiLCJTdXBwbHkiLCJTdXBwbHkuSW5nVHlwZSIsIlN1cHBseS5JbmdUeXBlLmNvbnN0cnVjdG9yIiwiU3VwcGx5LkluZ1R5cGUuYWxsIiwiU3VwcGx5LkluZ1R5cGUub2YiLCJTdXBwbHkuSW5nVHlwZS50b1N0cmluZyIsIlN1cHBseS5CYXNlSW5nIiwiU3VwcGx5LkJhc2VJbmcuY29uc3RydWN0b3IiLCJTdXBwbHkuQmFzZUluZy50eXBlIiwiU3VwcGx5LkJhc2VJbmcuZGltZW5zaW9ucyIsIlN1cHBseS5CYXNlSW5nLnRvU3RyaW5nIiwiU3VwcGx5LkluZyIsIlN1cHBseS5JbmcuY29uc3RydWN0b3IiLCJTdXBwbHkuSW5nLnRvU3RyaW5nIiwiSW5ncmVkaWVudFNyYyIsIkluZ3JlZGllbnRTcmMuY29uc3RydWN0b3IiLCJJbmdyZWRpZW50U3JjLmFkZEFsbCIsIlN0ZXAiLCJTdGVwLmNvbnN0cnVjdG9yIiwiU3RlcC50b1N0cmluZyIsIlN0ZXBUeXBlIiwiU3RlcFR5cGUuY29uc3RydWN0b3IiLCJSZWFjdG9yIiwiUmVhY3Rvci5jb25zdHJ1Y3RvciIsIlJlYWN0b3IuYWRkQWZ0ZXIiLCJSZWFjdG9yLmNyZWF0ZUFub24iLCJSZWFjdG9yLmlzUmVhY3RvciIsIlJlYWN0b3IubmV4dElkIiwiSW5ncmVkaWVudHMiLCJJbmdyZWRpZW50cy5jb25zdHJ1Y3RvciIsIkluZ3JlZGllbnRzLmxpc3RBbGxJbmdyZWRpZW50cyIsIkluZ3JlZGllbnRzLmdldEZyb21JbnZlbnRvcnkiLCJJbmdyZWRpZW50cy5hZGRUb0ludmVudG9yeSIsIkluZ3JlZGllbnRzLmFkZFNyYyIsIlJlY2lwZSIsIlJlY2lwZS5jb25zdHJ1Y3RvciIsIlJlY2lwZS5hZGRSZWFjdG9yIiwiUmVjaXBlLmxpc3REeW5hbWljSW5ncmVkaWVudHMiLCJSZWNpcGUuX2dldE91dHB1dCIsIlJlY2lwZS5lbmNvZGUiLCJSZWNpcGUuZGVjb2RlIiwiUmVjaXBlLl9kZWNvZGVSZWFjdG9yIiwiUmVjaXBlLl9kZWNvZGVTdGVwIiwiUmVjaXBlLl9kZWNvZGVSZWYiLCJLZXlib2FyZCIsIktleWJvYXJkLmNvbnN0cnVjdG9yIiwiS2V5Ym9hcmQudG9TdHJpbmciLCJLZXlib2FyZC5mcm9tRXZ0IiwiS2V5Ym9hcmQuZ2V0S2V5QmluZGluZyIsIktleWJvYXJkLmdldENvZGVOYW1lIiwiU2hvcnRjdXQiLCJTaG9ydGN1dC5jb25zdHJ1Y3RvciIsIlNob3J0Y3V0cyIsIlNob3J0Y3V0cy5jb25zdHJ1Y3RvciIsIlNob3J0Y3V0cy5oYXNLZXkiLCJTaG9ydGN1dHMuZ2V0IiwiU2hvcnRjdXRzLmFkZCIsImJhc2UiLCJiYXNlLktleWJvYXJkQmFzZSIsImJhc2UuS2V5Ym9hcmRCYXNlLmNvbnN0cnVjdG9yIiwiYmFzZS5LZXlib2FyZEJhc2UudG9Db2RlIiwiYmFzZS5LZXlib2FyZEJhc2UudG9JZHgiLCJiYXNlLktleWJvYXJkQmFzZS5pc0lkeFZhbGlkIiwiYmFzZS5LZXlib2FyZEJhc2UuaXNDb2RlVmFsaWQiLCJNZXNzYWdlVHlwZSIsIk1lc3NhZ2VUeXBlLmNvbnN0cnVjdG9yIiwiU3VzY3JpYmVyIiwiU3VzY3JpYmVyLmNvbnN0cnVjdG9yIiwiRXZlbnRCdXMiLCJFdmVudEJ1cy5jb25zdHJ1Y3RvciIsIkV2ZW50QnVzLnB1Ymxpc2giLCJFdmVudEJ1cy5zdXNjcmliZSIsIkV2ZW50QnVzLnB1Ymxpc2hBbmRXYWl0Rm9yIiwiRXZlbnRCdXMubG9nIiwiRXZlbnRCdXMudHJpZ2dlciIsIlVuaXQiLCJVbml0LmNvbnN0cnVjdG9yIiwiVW5pdC50b1N0cmluZyIsIlF1YW50aXR5IiwiUXVhbnRpdHkuY29uc3RydWN0b3IiLCJRdWFudGl0eS50b1N0cmluZyIsIkxpc3ROb2RlIiwiTGlzdE5vZGUuY29uc3RydWN0b3IiLCJMaXN0IiwiTGlzdC5jb25zdHJ1Y3RvciIsIkxpc3QucHVzaCIsIlNlcnZlckltcGwiLCJTZXJ2ZXJJbXBsLmNvbnN0cnVjdG9yIiwiU2VydmVySW1wbC5lbmRwb2ludCIsIlNlcnZlckltcGwuc3luY0ludmVudG9yeSIsIlNlcnZlckltcGwuX29uQ2xvc2UiLCJTZXJ2ZXJJbXBsLl9vbkVycm9yIiwiU2VydmVySW1wbC5fb25NZXNzYWdlIiwiU2VydmVySW1wbC5fb25PcGVuIiwiSXRlbVR5cGUiLCJTdG9jayIsIlN0b2NrLmNvbnN0cnVjdG9yIiwiU3RvY2suZnJvbVJhdyIsIkl0ZW0iLCJJdGVtLmNvbnN0cnVjdG9yIiwiSXRlbS5mcm9tUmF3IiwiSW52ZW50b3J5IiwiSW52ZW50b3J5LmNvbnN0cnVjdG9yIiwiSW52ZW50b3J5Lmxpc3RJdGVtIiwiSW52ZW50b3J5LmFkZEl0ZW0iLCJTeXN0ZW1JbXBsIiwiU3lzdGVtSW1wbC5jb25zdHJ1Y3RvciIsIlN5c3RlbUltcGwuc3ltIiwiU3lzdGVtSW1wbC5kaW0iLCJTeXN0ZW1JbXBsLmdldEJ5SWQiLCJVbml0U3lzdGVtIiwiVW5pdFN5c3RlbS5jb25zdHJ1Y3RvciIsIlVuaXRTeXN0ZW0uYWxsIiwiVW5pdFN5c3RlbS5nZXRVbml0Il0sIm1hcHBpbmdzIjoiQUFNQTtJQU1FQSxpQkFBWUEsR0FBVUEsRUFBRUEsSUFBV0E7UUFDakNDLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLElBQUlBLE9BQU9BLEdBQUdBLE9BQU9BLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO1FBQ2xEQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUNqQkEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsR0FBR0EsS0FBS0EsSUFBSUEsQ0FBQ0E7SUFDN0JBLENBQUNBO0lBRURELDBCQUFRQSxHQUFSQSxjQUFxQkUsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFFakNGLGtCQUFVQSxHQUFqQkEsVUFBa0JBLElBQVdBLElBQWlCRyxNQUFNQSxDQUFDQSxJQUFJQSxPQUFPQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUN4RUgsY0FBTUEsR0FBYkEsVUFBY0EsR0FBVUEsRUFBRUEsSUFBV0EsSUFBaUJJLE1BQU1BLENBQUNBLElBQUlBLE9BQU9BLENBQUNBLEdBQUdBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0lBZHZFSixtQkFBV0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7SUFlakNBLGNBQUNBO0FBQURBLENBaEJBLEFBZ0JDQSxJ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SUFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDcEJBLElBQUlBLENBQUNBLGVBQWVBLEdBQUdBLENBQUNBLENBQUNBO1FBQ3pCQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUNyQkEsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsVUFBVUEsQ0FBQ0E7UUFDM0JBLElBQUlBLENBQUNBO1lBQ0RBLElBQUlBLENBQUNBLEVBQUVBLEdBQUdBLElBQUlBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ3RDQSxDQUFFQTtRQUFBQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNUQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM1QkEsQ0FBQ0E7UUFFREEsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsRUFBRUEsQ0FBQ0E7UUFFekJBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBQzNDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUMzQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDL0NBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0lBQzNDQSxDQUFDQTtJQWxETUQsNkJBQVFBLEdBQWZBO1FBQ0VFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNB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QUNBO1FBQ3pFQSxJQUFJQSxJQUFJQSxDQUFDQSxJQUFJQSxPQUFPQSxDQUFDQSxhQUFhQSxFQUFFQSxRQUFRQSxDQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxXQUFXQSxFQUFFQSxJQUFJQSxDQUFDQTtRQUNoRkEsSUFBSUEsSUFBSUEsQ0FBQ0EsSUFBSUEsT0FBT0EsQ0FBQ0EsY0FBY0EsRUFBRUEsU0FBU0EsQ0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsV0FBV0EsRUFBRUEsSUFBSUEsQ0FBQ0E7UUFDbEZBLElBQUlBLElBQUlBLENBQUNBLElBQUlBLE9BQU9BLENBQUNBLGFBQWFBLEVBQUVBLFFBQVFBLENBQUNBLEVBQUVBLEtBQUtBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLFFBQVFBLEVBQUVBLElBQUlBLENBQUNBO0tBQ2hGQSxDQUFDQSxDQUFDQTtJQUNXQSxpQkFBTUEsR0FBR0EsSUFBSUEsVUFBVUEsQ0FBQ0EsVUFBVUEsRUFBRUE7UUFDOUNBLElBQUlBLElBQUlBLENBQUNBLElBQUlBLE9BQU9BLENBQUNBLFdBQVdBLEVBQUVBLE1BQU1BLENBQUNBLEVBQUVBLElBQUlBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLE1BQU1BLEVBQUVBLElBQUlBLENBQUNBO1FBQ3hFQSxJQUFJQSxJQUFJQSxDQUFDQSxJQUFJQSxPQUFPQSxDQUFDQSxXQUFXQSxFQUFFQSxNQUFNQSxDQUFDQSxFQUFFQSxJQUFJQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxNQUFNQSxFQUFFQSxJQUFJQSxDQUFDQTtRQUN4RUEsSUFBSUEsSUFBSUEsQ0FBQ0EsSUFBSUEsT0FBT0EsQ0FBQ0EsVUFBVUEsRUFBRUEsS0FBS0EsQ0FBQ0EsRUFBRUEsS0FBS0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsQ0FBQ0E7UUFDdkVBLElBQUlBLElBQUlBLENBQUNBLElBQUlBLE9BQU9BLENBQUNBLFVBQVVBLEVBQUVBLFVBQVVBLENBQUNBLEVBQUVBLEtBQUtBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLE1BQU1BLEVBQUVBLElBQUlBLENBQUNBO1FBQzVFQSxJQUFJQSxJQUFJQSxDQUFDQSxJQUFJQSxPQUFPQSxDQUFDQSxnQkFBZ0JBLEVBQUVBLFdBQVdBLENBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLFdBQVdBLEVBQUVBLElBQUlBLENBQUNBO0tBQ3pGQSxDQUFDQSxDQUFDQTtJQUNXQSxtQkFBUUEsR0FBR0EsSUFBSUEsVUFBVUEsQ0FBQ0EsVUFBVUEsRUFBRUEsRUFDbkRBLENBQUNBLENBQUNBO0lBY0xBLGlCQUFDQTtBQUFEQSxDQTlCQSxBQThCQ0EsSUFBQTtBQUVELElBQ0UsRUFBRSxHQUFlLFVBQVUsQ0FBQyxFQUFFLEVBQzlCLE1BQU0sR0FBZSxVQUFVLENBQUMsTUFBTSxFQUN0QyxRQUFRLEdBQWUsVUFBVSxDQUFDLFFBQVEsQ0FBQyIsImZpbGUiOiJicmV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW50ZXJmYWNlIENvbmNlcHRSZWYge1xuICBpc0Fub246IGJvb2xlYW47XG4gIHJlZjogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbmNsYXNzIE9udG9SZWYgaW1wbGVtZW50cyBDb25jZXB0UmVmIHtcbiAgcHJpdmF0ZSBzdGF0aWMgbmV4dEFub25SZWYgPSAwO1xuICByZWY6IHN0cmluZztcbiAgaXNBbm9uOiBib29sZWFuO1xuICBuYW1lOiBzdHJpbmc7XG4gIFxuICBjb25zdHJ1Y3RvcihyZWY6c3RyaW5nLCBuYW1lOnN0cmluZykge1xuICAgIHRoaXMucmVmID0gcmVmIHx8ICdhbm9uOicgKyBPbnRvUmVmLm5leHRBbm9uUmVmKys7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmlzQW5vbiA9IHJlZiA9PT0gbnVsbDsgICAgXG4gIH1cbiAgXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLm5hbWU7IH1cbiAgXG4gIHN0YXRpYyBjcmVhdGVBbm9uKG5hbWU6c3RyaW5nKSA6IENvbmNlcHRSZWYgeyByZXR1cm4gbmV3IE9udG9SZWYobnVsbCwgbmFtZSk7IH1cbiAgc3RhdGljIGNyZWF0ZShyZWY6c3RyaW5nLCBuYW1lOnN0cmluZykgOiBDb25jZXB0UmVmIHsgcmV0dXJuIG5ldyBPbnRvUmVmKHJlZiwgbmFtZSk7IH1cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS9jb25jZXB0UmVmLnRzXCIgLz5cblxuY2xhc3MgRW50aXRpZXMge1xuICAgIHN0YXRpYyB0YXBXYXRlcjogQ29uY2VwdFJlZiA9IG5ldyBPbnRvUmVmKCdicmV3OnRhcFdhdGVyJywgJ1RhcCBXYXRlcicpO1xuICAgIHN0YXRpYyBpbnZlbnRvcnk6IENvbmNlcHRSZWYgPSBuZXcgT250b1JlZignYnJldzpwZXJzb25hbEludmVudG9yeScsICdQZXJzb25hbCBJbnZlbnRvcnknKTtcbiAgICBzdGF0aWMga2c6IENvbmNlcHRSZWYgPSBuZXcgT250b1JlZigndW5pdDpraWxvZ3JhbScsICdraWxvZ3JhbScpO1xuICAgIHN0YXRpYyBsaXRlcjogQ29uY2VwdFJlZiA9IG5ldyBPbnRvUmVmKCd1bml0OmxpdGVyJywgJ2xpdGVyJyk7XG4gICAgc3RhdGljIHN5cnVwOiBDb25jZXB0UmVmID0gbmV3IE9udG9SZWYoJ2JyZXc6YnJld2Vyc1N5cm9wJywgJ0JyZXdlclxcJ3MgU3lydXAnKTtcbiAgICBzdGF0aWMgZG1lOiBDb25jZXB0UmVmID0gbmV3IE9udG9SZWYoJ2JyZXc6ZG1lJywgJ0RyeSBNYWx0IEV4dHJhY3QnKTtcbiAgICBzdGF0aWMgYzEyMDogQ29uY2VwdFJlZiA9IG5ldyBPbnRvUmVmKCdicmV3OmNyeXN0YWwxMjAnLCAnQ3J5c3RhbCAxMjAnKTtcbiAgICBzdGF0aWMgYzYwOiBDb25jZXB0UmVmID0gbmV3IE9udG9SZWYoJ2JyZXc6Y3J5c3RhbDYwJywgJ0NyeXN0YWwgNjAnKTtcbiAgICBzdGF0aWMgcGFsZUNob2NvOiBDb25jZXB0UmVmID0gbmV3IE9udG9SZWYoJ2JyZXc6UGFsZUNob2NvbGF0ZScsICdQYWxlIENob2NvbGF0ZScpO1xuICAgIHN0YXRpYyBibGFja01hbHQ6IENvbmNlcHRSZWYgPSBuZXcgT250b1JlZignYnJldzpCbGFja01hbHQnLCAnQmxhY2sgTWFsdCcpO1xuICAgIHN0YXRpYyBmbGFrZWRSeWU6IENvbmNlcHRSZWYgPSBuZXcgT250b1JlZignYnJldzpGbGFrZWRSeWUnLCAnRmxha2VkIFJ5ZScpO1xuICAgIHN0YXRpYyByb2xsZWRPYXQ6IENvbmNlcHRSZWYgPSBuZXcgT250b1JlZignYnJldzpSb2xsZWRPYXQnLCAnUm9sbGVkIE9hdCcpO1xuICAgIFxuICAgIHN0YXRpYyB5ZWFzdE51dHJpZW50OiBDb25jZXB0UmVmID0gbmV3IE9udG9SZWYoJ2JyZXc6eWVhc3ROdXRyaWVudCcsICdZZWFzdCBOdXRyaWVudCcpO1xuICAgIFxuICAgIHN0YXRpYyB3MjExMjogQ29uY2VwdFJlZiA9IG5ldyBPbnRvUmVmKCdicmV3OncyMTEyJywgJ1d5ZWFzdCBDYWxpZm9ybmlhIExhZ2VyJyk7XG59IiwiY2xhc3MgQ2FuY2VsRXJyb3IgaW1wbGVtZW50cyBFcnJvciB7XG4gIG5hbWU6IHN0cmluZyA9ICdDYW5jZWwnO1xuICBtZXNzYWdlOiBzdHJpbmcgPSAnT3BlcmF0aW9uIGhhcyBiZWVuIGNhbmNlbGxlZC4nO1xufVxuY2xhc3MgVW5pbXBsZW1lbnRlZEVycm9yIGltcGxlbWVudHMgRXJyb3Ige1xuICBuYW1lOiBzdHJpbmcgPSAnVW5pbXBsZW1lbnRlZCc7XG4gIG1lc3NhZ2U6IHN0cmluZyA9ICdPcGVyYXRpb24gbm90IHlldCBpbXBsZW1lbnRlZC4nO1xufVxuY2xhc3MgSW52YWxpZFN0YXRlRXJyb3IgaW1wbGVtZW50cyBFcnJvciB7XG4gIG5hbWU6IHN0cmluZyA9ICdJbnZhbGlkU3RhdGUnO1xuICBtZXNzYWdlOiBzdHJpbmcgPSAnSW52YWxpZCBzdGF0ZSByZWFjaGVkLic7XG59IiwiLyoqXG4gKiBSZXByZXNlbnRzIGEgdW5pdCBkaW1lbnNpb24uXG4gKiBcbiAqIFdoZXRoZXIgaXQgaXMgYSB1bml0IG9mIG1hc3MsIGEgdW5pdCBvZiBsZW5ndGgsIC4uLlxuICovXG5jbGFzcyBEaW0ge1xuXHRwdWJsaWMgc3RhdGljIExlbmd0aCA9IG5ldyBEaW0oKTtcblx0cHVibGljIHN0YXRpYyBNYXNzID0gbmV3IERpbSgpO1xuXHRwdWJsaWMgc3RhdGljIFRlbXBlcmF0dXJlID0gbmV3IERpbSgpO1xuXHRwdWJsaWMgc3RhdGljIFZvbHVtZSA9IG5ldyBEaW0oKTtcblx0cHVibGljIHN0YXRpYyBUZW1wb3JhbCA9IG5ldyBEaW0oKTtcblx0XG5cdHB1YmxpYyBzdGF0aWMgYWxsKCkgeyByZXR1cm4gW0RpbS5MZW5ndGgsIERpbS5NYXNzLCBEaW0uVGVtcGVyYXR1cmUsIERpbS5Wb2x1bWVdOyB9XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2Jhc2UvY29uY2VwdFJlZi50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdW5pdHMvZGltZW5zaW9uLnRzXCIgLz5cblxubW9kdWxlIFN1cHBseSB7XG5cdGV4cG9ydCBjbGFzcyBJbmdUeXBlIHtcblx0XHRwdWJsaWMgc3RhdGljIEZlcm1lbnRhYmxlID0gbmV3IEluZ1R5cGUoJ2Zlcm1lbnRhYmxlJyk7XG5cdFx0cHVibGljIHN0YXRpYyBIb3BzID0gbmV3IEluZ1R5cGUoJ2hvcHMnKTtcblx0XHRwdWJsaWMgc3RhdGljIFllYXN0ID0gbmV3IEluZ1R5cGUoJ3llYXN0Jyk7XG5cdFx0cHVibGljIHN0YXRpYyBNaXNjZWxsYW5lb3VzICA9IG5ldyBJbmdUeXBlKCdtaXNjZWxsYW5lb3VzJyk7XG5cdFx0cHVibGljIHN0YXRpYyBEeW5hbWljID0gbmV3IEluZ1R5cGUoJ2R5bmFtaWMnKTtcblx0XHRwdWJsaWMgc3RhdGljIGFsbCgpIHtcblx0XHRcdHJldHVybiBbXG5cdFx0XHRcdEluZ1R5cGUuRmVybWVudGFibGUsXG5cdFx0XHRcdEluZ1R5cGUuSG9wcyxcblx0XHRcdFx0SW5nVHlwZS5ZZWFzdCxcblx0XHRcdFx0SW5nVHlwZS5NaXNjZWxsYW5lb3VzLFxuXHRcdFx0XHRJbmdUeXBlLkR5bmFtaWNcblx0XHRcdF07XG5cdFx0fVxuXHRcdFxuXHRcdHB1YmxpYyBuYW1lOiBzdHJpbmc7XG5cdFx0XG5cdFx0Y29uc3RydWN0b3IobmFtZSA6IHN0cmluZykge1xuXHRcdFx0dGhpcy5uYW1lID0gbmFtZTtcblx0XHR9XG5cdFx0XG5cdFx0cHVibGljIHN0YXRpYyBvZihuYW1lOiBzdHJpbmcpIDogSW5nVHlwZSB7XG5cdFx0XHR2YXIgZm91bmQgPSBJbmdUeXBlLmFsbCgpLmZpbHRlcih0ID0+IHQubmFtZSA9PT0gbmFtZSk7XG5cdFx0XHRyZXR1cm4gZm91bmQubGVuZ3RoID09PSAxID8gZm91bmRbMF0gOiBudWxsO1xuXHRcdH1cblx0XHRcblx0XHRwdWJsaWMgdG9TdHJpbmcoKSA6IHN0cmluZyB7XG5cdFx0XHRyZXR1cm4gdGhpcy5uYW1lO1xuXHRcdH1cblx0fVxuXHRcblx0LyoqXG5cdCAqIFJlcHJlc2VudHMgdGhlIGFic3RyYWN0IGNvbmNlcHQgb2YgY2VydGFpbiBpbmdyZWRpZW50LlxuXHQgKiBcblx0ICogRm9yIGV4YW1wbGUsIEhhbGxlcnRhdWVyIGlzIGEgYmFzZSBpbmdyZWRpZW50IGJ1dCBIYWxsZXJ0YXVlciAodXMpXG5cdCAqIGZyb20gYSBjZXJ0YWluIHBsYWNlIGFuZCBoYXZpbmcgYSBjZXJ0YWluIEFBIGlzIGEgSW5ncmVkaWVudC5cblx0ICovXG5cdGV4cG9ydCBjbGFzcyBCYXNlSW5nIHtcblx0XHRwcml2YXRlIF90eXBlOiBJbmdUeXBlO1xuXHRcdHByaXZhdGUgX2RpbWVuc2lvbnM6IEFycmF5PERpbT47XG5cdFx0XG5cdFx0cHVibGljIHJlZjogQ29uY2VwdFJlZjtcblx0XHRcblx0XHRjb25zdHJ1Y3Rvcihjb25jZXB0OiBDb25jZXB0UmVmLCB0eXBlOiBJbmdUeXBlLCBkaW1lbnNpb25zOiBBcnJheTxEaW0+ID0gW10pIHtcblx0XHRcdHRoaXMucmVmID0gY29uY2VwdDtcblx0XHRcdHRoaXMuX3R5cGUgPSB0eXBlO1xuXHRcdFx0dGhpcy5fZGltZW5zaW9ucyA9IGRpbWVuc2lvbnM7XG5cdFx0fVxuXHRcdFxuXHRcdHB1YmxpYyB0eXBlKCkgOiBJbmdUeXBlIHsgcmV0dXJuIHRoaXMuX3R5cGU7IH1cblx0XHRwdWJsaWMgZGltZW5zaW9ucygpIDogQXJyYXk8RGltPiB7IHJldHVybiB0aGlzLl9kaW1lbnNpb25zOyB9XG5cdFx0cHVibGljIHRvU3RyaW5nKCkgOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5yZWYubmFtZTsgfVxuXHR9XG5cdFxuXHQvKipcblx0ICogUmVwcmVzZW50IGFuIGluZ3JlZGllbnQgYnV0IG5vdCBpdHMgYXNzb2NpYXRlZCBzdXBwbGllcy5cblx0ICovXG5cdGV4cG9ydCBjbGFzcyBJbmcgZXh0ZW5kcyBCYXNlSW5nIHtcblx0XHRjb25zdHJ1Y3Rvcihjb25jZXB0OiBDb25jZXB0UmVmLCB0eXBlOiBJbmdUeXBlLCBkaW1lbnNpb25zOiBBcnJheTxEaW0+ID0gW10pIHtcblx0XHRcdHN1cGVyKGNvbmNlcHQsIHR5cGUsIGRpbWVuc2lvbnMpO1xuXHRcdH1cblx0XHRwdWJsaWMgdG9TdHJpbmcoKSA6IHN0cmluZyB7IHJldHVybiB0aGlzLnJlZi5uYW1lOyB9XG5cdH1cdFxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlL2NvbmNlcHRSZWYudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInN1cHBseS9pbmdyZWRpZW50XCIgLz5cblxuY2xhc3MgSW5ncmVkaWVudFNyYyB7XG5cdGNvbmNlcHQ6IENvbmNlcHRSZWY7XG5cdHN0b2NrczogQXJyYXk8U3VwcGx5LkluZz47XG5cdFxuXHRjb25zdHJ1Y3Rvcihjb25jZXB0IDogQ29uY2VwdFJlZikge1xuXHRcdHRoaXMuY29uY2VwdCA9IGNvbmNlcHQ7XG5cdFx0dGhpcy5zdG9ja3MgPSBbXTtcblx0fVxuXHRcblx0YWRkQWxsKGl0ZW1zIDogQXJyYXk8U3VwcGx5LkluZz4pIHtcblx0XHR0aGlzLnN0b2NrcyA9IHRoaXMuc3RvY2tzLmNvbmNhdChpdGVtcyk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS9jb25jZXB0UmVmLnRzXCIgLz5cblxuLyoqIFRoaXMgd2lsbCBuZWVkIHRvIGJlIHJldmlld2VkIHdpdGggc3BlY2lmaWMgc3ViLWNsYXNzZXMuICovXG5jbGFzcyBTdGVwIHtcblxuXHRwcml2YXRlIHN0YXRpYyBpZHggPSAwO1xuXG5cdHB1YmxpYyBpZDogc3RyaW5nO1xuXHRwdWJsaWMgbmFtZTogc3RyaW5nO1xuXHRwdWJsaWMgdHlwZTogQ29uY2VwdFJlZlxuXG5cdGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdHlwZTogQ29uY2VwdFJlZiwgaWQ6IHN0cmluZyA9ICdhbm9uOicgKyBTdGVwLmlkeCsrKSB7XG5cdFx0dGhpcy5pZCA9IGlkO1xuXHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0dGhpcy50eXBlID0gdHlwZTtcblx0fVxuXG5cdHB1YmxpYyB0b1N0cmluZygpIDogc3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy5uYW1lO1xuXHR9XG59XG5cbi8qKlxuICogU3RlcCB0eXBlIG9iamVjdCBmb3IgZWFzeSBhdXRvY29tcGxldGUuXG4gKlxuICogU2hvdWxkIGJlIGZpbGxlZCBmcm9tIHRoZSBvbnRvbG9neSBhbmQgc2hvdWxkIGJlIHVzZWQgdXNpbmcgdGhlIFN0ZXAgb2JqZWN0LlxuICovXG5jbGFzcyBTdGVwVHlwZSB7XG5cdHB1YmxpYyBzdGF0aWMgYWRkSW5ncmVkaWVudDogQ29uY2VwdFJlZiA9IE9udG9SZWYuY3JlYXRlQW5vbignQWRkIEluZ3JlZGllbnQnKTtcblx0cHVibGljIHN0YXRpYyBkZWZpbmVPdXRwdXQ6IENvbmNlcHRSZWYgPSBPbnRvUmVmLmNyZWF0ZUFub24oJ0RlZmluZSBPdXRwdXQnKTtcblx0cHVibGljIHN0YXRpYyBmZXJtZW50OiBDb25jZXB0UmVmID0gT250b1JlZi5jcmVhdGVBbm9uKCdGZXJtZW50Jyk7XG5cdHB1YmxpYyBzdGF0aWMgaGVhdGluZzogQ29uY2VwdFJlZiA9IE9udG9SZWYuY3JlYXRlQW5vbignQ2hhbmdlIG9mIFRlbXAuJyk7XG5cdHB1YmxpYyBzdGF0aWMgbWVyZ2luZzogQ29uY2VwdFJlZiA9IE9udG9SZWYuY3JlYXRlQW5vbignTWVyZ2luZycpO1xuXHRwdWJsaWMgc3RhdGljIHNwbGl0dGluZzogQ29uY2VwdFJlZiA9IE9udG9SZWYuY3JlYXRlQW5vbignU3BsaXR0aW5nJyk7XG5cblx0Ly8gU2hvdWxkIG5vdCBiZSBpbiBhbGwsIHNpbmNlIHNlbnRpbmVsIHN0ZXAuXG5cdHN0YXRpYyBzdGFydDogQ29uY2VwdFJlZiA9IE9udG9SZWYuY3JlYXRlQW5vbignU3RhcnQnKTtcblxuXHRzdGF0aWMgQWxsIDogQXJyYXk8Q29uY2VwdFJlZj4gPSBbXG5cdFx0XHRTdGVwVHlwZS5hZGRJbmdyZWRpZW50LFxuXHRcdFx0U3RlcFR5cGUuZGVmaW5lT3V0cHV0LFxuXHRcdFx0U3RlcFR5cGUuZmVybWVudCxcblx0XHRcdFN0ZXBUeXBlLmhlYXRpbmcsXG5cdFx0XHRTdGVwVHlwZS5tZXJnaW5nLFxuXHRcdFx0U3RlcFR5cGUuc3BsaXR0aW5nXG5cdF07XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImluZ3JlZGllbnRTcmMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInN0ZXAudHNcIiAvPlxuXG5jbGFzcyBSZWFjdG9yIHtcblx0cHJpdmF0ZSBzdGF0aWMgbmV4dElkeDpudW1iZXIgPSAwO1xuXHRcblx0cHVibGljIGlkOiBudW1iZXI7XG5cdHB1YmxpYyBuYW1lOiBzdHJpbmc7XG5cdHB1YmxpYyBzdGVwczogQXJyYXk8U3RlcD47XG5cdFxuXHRjb25zdHJ1Y3RvcihpZDogbnVtYmVyID0gMCwgbmFtZTogc3RyaW5nID0gJ0Fub255bW91cycsIHN0ZXBzOiBBcnJheTxTdGVwPiA9IFtuZXcgU3RlcCgnc3RhcnQnLCBTdGVwVHlwZS5zdGFydCldKSB7XG5cdFx0dGhpcy5pZCA9IGlkO1xuXHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0dGhpcy5zdGVwcyA9IHN0ZXBzO1xuXHR9XG5cdFxuXHRwdWJsaWMgYWRkQWZ0ZXIobGhzOiBhbnksIG5ld09iajogYW55KSB7XG5cdFx0aWYgKG5ld09iai50aW1pbmcgPT09ICdBZnRlcicpIHtcbiAgICAgIFx0XHR2YXIgaWR4ID0gdGhpcy5zdGVwcy5pbmRleE9mKGxocyk7XG4gICAgICBcdFx0dGhpcy5zdGVwcy5zcGxpY2UoaWR4ICsgMSwgMCwgbmV3IFN0ZXAoJ0Fub255bW91cycsIG51bGwpKTtcbiAgICBcdH1cblx0fVxuXHRcblx0cHVibGljIHN0YXRpYyBjcmVhdGVBbm9uKCkge1xuXHRcdHJldHVybiBuZXcgUmVhY3RvcihSZWFjdG9yLm5leHRJZHgpO1xuXHR9XG5cdHB1YmxpYyBzdGF0aWMgaXNSZWFjdG9yKHJlYWN0b3I6IFJlYWN0b3IpIHtcblx0XHRyZXR1cm4gcmVhY3Rvci5pZCAhPT0gdW5kZWZpbmVkIFxuXHRcdFx0JiYgcmVhY3Rvci5zdGVwcyAhPT0gdW5kZWZpbmVkIFxuXHRcdFx0JiYgQXJyYXkuaXNBcnJheShyZWFjdG9yLnN0ZXBzKTtcblx0fVxuXHRwcml2YXRlIHN0YXRpYyBuZXh0SWQoKSB7XG5cdFx0cmV0dXJuICdyZWFjdG9yOicgKyBSZWFjdG9yLm5leHRJZHgrKztcblx0fVxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJyZWFjdG9yLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlL2NvbmNlcHRSZWYudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInN1cHBseS9pbmdyZWRpZW50XCIgLz5cblxuY2xhc3MgSW5ncmVkaWVudHMge1xuXHRpbnZlbnRvcnk6IEFycmF5PFN1cHBseS5Jbmc+ID0gW107XG5cdHJlYWN0b3JzOiBBcnJheTxSZWFjdG9yPiA9IFtdO1xuXHRcblx0bGlzdEFsbEluZ3JlZGllbnRzKCkge1xuXHRcdHJldHVybiBbXS5jb25jYXQodGhpcy5pbnZlbnRvcnkpO1xuXHR9XG5cdFxuXHRnZXRGcm9tSW52ZW50b3J5KGNvbmNlcHQ6IENvbmNlcHRSZWYpIHtcblx0XHRyZXR1cm4gdGhpcy5pbnZlbnRvcnkuZmlsdGVyKChpKSA9PiB7IHJldHVybiBpLnJlZiA9PT0gY29uY2VwdDsgfSk7XG5cdH1cblx0XG5cdGFkZFRvSW52ZW50b3J5KGluZ3JlZGllbnQ6IFN1cHBseS5JbmcpIHtcblx0XHR0aGlzLmludmVudG9yeS5wdXNoKGluZ3JlZGllbnQpO1xuXHR9XG5cdGFkZFNyYyhyZWFjdG9yOiBSZWFjdG9yKSB7XG5cdFx0aWYgKHRoaXMucmVhY3RvcnMuc29tZSgocykgPT4geyByZXR1cm4gcy5pZCA9PSByZWFjdG9yLmlkOyB9KSlcblx0XHQgIHJldHVybjtcblx0XHR0aGlzLnJlYWN0b3JzLnB1c2gocmVhY3Rvcik7XG5cdH1cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwicmVhY3Rvci50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic3VwcGx5L2luZ3JlZGllbnQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImVudGl0aWVzLnRzXCIgLz5cblxuY2xhc3MgUmVjaXBlIHtcbiAgbmFtZTogc3RyaW5nO1xuICByZWFjdG9yczogQXJyYXk8UmVhY3Rvcj47XG5cdFxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcgPSAnQW5vbnltb3VzJywgcmVhY3RvcnM6IEFycmF5PFJlYWN0b3I+ID0gW1JlYWN0b3IuY3JlYXRlQW5vbigpXSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5yZWFjdG9ycyA9IHJlYWN0b3JzO1xuICB9XG5cdFxuICBhZGRSZWFjdG9yKHJlYWN0b3I6UmVhY3Rvcikge1xuICAgIGlmICghUmVhY3Rvci5pc1JlYWN0b3IocmVhY3RvcikpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiW1JlY2lwZV0gT2JqZWN0IGFkZGVkIGlzIG5vdCBhIHJlYWN0b3JcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucmVhY3RvcnMucHVzaChyZWFjdG9yKTtcbiAgfVxuICBcbiAgbGlzdER5bmFtaWNJbmdyZWRpZW50cygpIDogU3VwcGx5LkluZ1tdIHtcblx0ICByZXR1cm4gW1xuICAgICAgbmV3IFN1cHBseS5JbmcoRW50aXRpZXMudGFwV2F0ZXIsIG51bGwsIFtEaW0uVm9sdW1lXSkgXG4gICAgXS5jb25jYXQodGhpcy5yZWFjdG9ycy5yZWR1Y2UodGhpcy5fZ2V0T3V0cHV0LmJpbmQodGhpcyksIFtdKSk7XG4gIH1cbiAgXG4gIHByaXZhdGUgX2dldE91dHB1dChsYXN0OiBPYmplY3RbXSwgZWxlbTogUmVhY3Rvcikge1xuICAgIHJldHVybiBsYXN0LmNvbmNhdChlbGVtLnN0ZXBzLmZpbHRlcihzID0+IHMudHlwZSA9PT0gU3RlcFR5cGUuZGVmaW5lT3V0cHV0KSk7XG4gIH1cbiAgXG4gIHB1YmxpYyBlbmNvZGUoKSA6IE9iamVjdCB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMpO1xuICB9XG4gIFxuICBwdWJsaWMgc3RhdGljIGRlY29kZShvIDoge1trZXk6IHN0cmluZ106IGFueX0pIHtcbiAgICB2YXIgbmFtZSA9IG9bJ25hbWUnXTtcbiAgICB2YXIgcmVhY3RvcnMgPSBvWydyZWFjdG9ycyddLm1hcChSZWNpcGUuX2RlY29kZVJlYWN0b3IpO1xuICAgIHJldHVybiBuZXcgUmVjaXBlKG5hbWUsIHJlYWN0b3JzKTtcbiAgfVxuICBcbiAgcHJpdmF0ZSBzdGF0aWMgX2RlY29kZVJlYWN0b3IobyA6IHtba2V5OiBzdHJpbmddOiBhbnl9KSA6IFJlYWN0b3Ige1xuICAgIHJldHVybiBuZXcgUmVhY3RvcihcbiAgICAgIDxudW1iZXI+KG9bJ2lkJ10pLFxuICAgICAgPHN0cmluZz4ob1snbmFtZSddKSxcbiAgICAgIDxBcnJheTxTdGVwPj4ob1snc3RlcHMnXS5tYXAoUmVjaXBlLl9kZWNvZGVTdGVwKSlcbiAgICApO1xuICB9XG4gIHByaXZhdGUgc3RhdGljIF9kZWNvZGVTdGVwKG8gOiB7W2tleTogc3RyaW5nXTogYW55fSkgOiBTdGVwIHtcbiAgICByZXR1cm4gbmV3IFN0ZXAoXG4gICAgICA8c3RyaW5nPihvWyduYW1lJ10pLFxuICAgICAgPENvbmNlcHRSZWY+KG9bJ3R5cGUnXSksXG4gICAgICA8c3RyaW5nPihvWydpZCddKVxuICAgICk7XG4gIH1cbiAgcHJpdmF0ZSBzdGF0aWMgX2RlY29kZVJlZihvIDoge1trZXk6IHN0cmluZ106IGFueX0pIDogQ29uY2VwdFJlZiB7XG4gICAgcmV0dXJuIG5ldyBPbnRvUmVmKFxuICAgICAgPHN0cmluZz4ob1sncmVmJ10pLFxuICAgICAgPHN0cmluZz4ob1snbmFtZSddKVxuICAgICk7XG4gIH1cbn0iLCJjbGFzcyBLZXlib2FyZCB7XG5cdHByaXZhdGUgZXZlbnQ6IEtleWJvYXJkRXZlbnQ7XG5cdGJpbmRpbmc6IHN0cmluZztcblx0XG5cdGNvbnN0cnVjdG9yKGV2ZW50OktleWJvYXJkRXZlbnQpIHtcblx0XHR0aGlzLmV2ZW50ID0gZXZlbnQ7XG5cdFx0dGhpcy5iaW5kaW5nID0gS2V5Ym9hcmQuZ2V0S2V5QmluZGluZyhldmVudCk7XG5cdH1cblx0XG5cdHRvU3RyaW5nKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHRoaXMuYmluZGluZztcblx0fVxuXHRcblx0c3RhdGljIGZyb21FdnQoZXZlbnQ6S2V5Ym9hcmRFdmVudCk6IEtleWJvYXJkIHtcblx0XHRyZXR1cm4gbmV3IEtleWJvYXJkKGV2ZW50KTtcblx0fVxuXHRzdGF0aWMgZ2V0S2V5QmluZGluZyhldmVudDpLZXlib2FyZEV2ZW50KSA6IHN0cmluZyB7XG5cdFx0dmFyIGJpbmRpbmc6QXJyYXk8c3RyaW5nPiA9IFtdO1xuXHRcdFxuXHRcdGlmIChldmVudC5hbHRLZXkpIGJpbmRpbmcucHVzaCgnYWx0Jyk7XG4gICAgXHRpZiAoZXZlbnQuY3RybEtleSkgYmluZGluZy5wdXNoKCdjdHJsJyk7XG5cdFx0aWYgKGV2ZW50Lm1ldGFLZXkpIGJpbmRpbmcucHVzaCgnbWV0YScpO1xuICAgIFx0aWYgKGV2ZW50LnNoaWZ0S2V5KSBiaW5kaW5nLnB1c2goJ3NoaWZ0Jyk7XG5cdFx0YmluZGluZy5wdXNoKHRoaXMuZ2V0Q29kZU5hbWUoZXZlbnQud2hpY2gpKTtcblx0XHRyZXR1cm4gYmluZGluZy5qb2luKCcrJyk7XG5cdH1cblx0c3RhdGljIGdldENvZGVOYW1lKGNvZGU6bnVtYmVyKSA6IHN0cmluZyB7XG5cdFx0aWYgKGNvZGUgPj0gMzMgJiYgY29kZSA8PSAxMjYpIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpO1xuXHRcdHN3aXRjaCAoY29kZSkge1xuXHRcdFx0Y2FzZSAgODogcmV0dXJuICdiYWNrc3BhY2UnO1xuXHRcdFx0Y2FzZSAxMzogcmV0dXJuICdlbnRlcic7XG5cdFx0XHRjYXNlIDE2OiByZXR1cm4gJ3NoaWZ0JzsgLyoqIFNoaWZ0IG9ubHkgKi9cblx0XHRcdGNhc2UgMTg6IHJldHVybiAnc2hpZnQnOyAvKiogQWx0ICAgb25seSAqL1xuXHRcdFx0Y2FzZSAyNzogcmV0dXJuICdlc2MnO1xuXHRcdFx0Y2FzZSAzMjogcmV0dXJuICdzcGFjZSc7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ1tLZXlib2FyZF1nZXRDb2RlTmFtZTogVW5rbm93biBDb2RlIE5hbWUgOicsIGNvZGUpO1xuXHRcdFx0XHRyZXR1cm4gJ3Vua253b24nO1xuXHRcdH1cblx0fVxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlL2tleWJvYXJkLnRzXCIgLz5cblxuLyoqXG4gKiBEZWZpbmVzIGEgc2hvcnRjdXQgd2l0aCBhIHBvc3NpYmxlIGJpbmRpbmcuXG4gKlxuICogVXNlZCB0byBiaW5kIGEgY2VydGFpbiBrZXkgY29tYmluYXRpb24gd2l0aCBhIFN1YlB1YiBtZXNzYWdlLlxuICovXG5jbGFzcyBTaG9ydGN1dCB7XG4gIC8qKiBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGtleSBjb21iaW5hdGlvbi4gKi9cbiAgcHVibGljIGJpbmRpbmc6c3RyaW5nO1xuICAvKiogQmFzaWMgZGVzY3JpcHRpb24gb2YgdGhlIGFjdGlvbiBleHBlY3RlZC4gbGVzcyB0aGFuIDgwIGNoYXIuICovXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjpzdHJpbmc7XG4gIC8qKiBUaGUgbWVzc2FnZSB0aGF0IHdpbGwgYmUgc2VudCBvbiBldmVudC4gKi9cbiAgcHVibGljIGludGVudDpNZXNzYWdlVHlwZTtcbn1cblxuLyoqXG4gKiBNYW5hZ2VyIG9mIHNob3J0Y3V0cywgbm8gbWV0aG9kIGlzIHN0YXRpYy4gVXNlIGRlZmF1bHQgZm9yIG1haW4gaW5zdGFuY2UuXG4gKi9cbmNsYXNzIFNob3J0Y3V0cyB7XG4gIC8qKiBMaXN0IG9mIGFsbCBib3VuZCBTaG9ydGN1dHMuICovXG4gIHB1YmxpYyBhbGw6QXJyYXk8U2hvcnRjdXQ+ID0gW107XG4gIC8qKiBNYXAgb2YgYmluZGluZyB0byBTaG9ydGN1dC4gKi9cbiAgcHVibGljIG1hcDp7IFttYXA6IHN0cmluZ106IFNob3J0Y3V0OyB9ID0ge31cblxuICBwdWJsaWMgaGFzS2V5KGtleTpLZXlib2FyZCk6Ym9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubWFwW2tleS50b1N0cmluZygpXSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIGdldChrZXk6S2V5Ym9hcmQpOlNob3J0Y3V0IHtcbiAgICByZXR1cm4gdGhpcy5tYXBba2V5LnRvU3RyaW5nKCldO1xuICB9XG5cbiAgLyoqIENoYWluYWJsZSBtZXRob2QgdG8gYWRkIGEgU2hvcnRjdXQgdG8gdGhpcyBtYW5hZ2VyLiAqL1xuICBhZGQoYmluZGluZzpzdHJpbmcsIGludGVudDpNZXNzYWdlVHlwZSwgZGVzY3JpcHRpb246c3RyaW5nKSB7XG4gICAgdmFyIG5ld1Nob3J0Y3V0OlNob3J0Y3V0ID0ge1xuICAgICAgYmluZGluZzogYmluZGluZyxcbiAgICAgIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbixcbiAgICAgIGludGVudDogaW50ZW50XG4gICAgfTtcbiAgICB0aGlzLmFsbC5wdXNoKG5ld1Nob3J0Y3V0KTtcbiAgICB0aGlzLm1hcFtiaW5kaW5nXSA9IG5ld1Nob3J0Y3V0O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG4iLCJtb2R1bGUgYmFzZSB7XG5cbiAgLyoqIEFsbG93cyB0byBlbmNvZGUgYSBudW1iZXIgdG8gYSBkaWZmZXJlbnQgYmFzZS4gKi9cbiAgZXhwb3J0IGludGVyZmFjZSBCYXNlQ29udmVydCB7XG4gICAgLyoqXG4gICAgICogQ29udmVydHMgdGhlIGluZGV4IHRvIGl0cyBiYXNlIGVxdWl2YWxlbnQuXG4gICAgICogQHBhcmFtIGlkeCBOdW1iZXIgdG8gY29udmVydHNcbiAgICAgKi9cbiAgICB0b0NvZGUoaWR4Om51bWJlcikgOiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogQ29udmVydHMgdGhlIGNvZGUgYmFjayBpbnRvIGl0cyBhc3NvY2lhdGVkIGluZGV4LlxuICAgICAqIEBwYXJhbSBiYXNlIEJhc2UgdG8gY29udmVydCBiYWNrLlxuICAgICAqL1xuICAgIHRvSWR4KGJhc2U6c3RyaW5nKSA6IG51bWJlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBjb2RlcyB0aGF0IGFyZSBlYXNpbHkgYWNjZXNzaWJsZSBmcm9tICBhIGtleWJvYXJkLlxuICAgKlxuICAgKiBVc2VmdWwgd2hlbiBwcm92aWRpbmcga2V5Ym9hcmQgc2hvcnRjdXRzIHRvIHRoZSB1c2VyLlxuICAgKi9cbiAgZXhwb3J0IGNsYXNzIEtleWJvYXJkQmFzZSBpbXBsZW1lbnRzIEJhc2VDb252ZXJ0IHtcbiAgICBwcml2YXRlIHN0YXRpYyBjb2RlczpzdHJpbmcgPSAnMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6JztcbiAgICBwcml2YXRlIHN0YXRpYyBlcnJvckNvZGU6c3RyaW5nID0gJy0nO1xuICAgIHByaXZhdGUgc3RhdGljIGVycm9ySWR4Om51bWJlciA9IC0xO1xuXG4gICAgcHVibGljIHRvQ29kZShpZHg6bnVtYmVyKTpzdHJpbmcge1xuICAgICAgcmV0dXJuIEtleWJvYXJkQmFzZS5pc0lkeFZhbGlkKGlkeCkgPyBLZXlib2FyZEJhc2UuY29kZXNbaWR4XSA6IEtleWJvYXJkQmFzZS5lcnJvckNvZGU7XG4gICAgfVxuXG4gICAgcHVibGljIHRvSWR4KGJhc2U6c3RyaW5nKTpudW1iZXIge1xuICAgICAgcmV0dXJuIEtleWJvYXJkQmFzZS5pc0NvZGVWYWxpZChiYXNlKSA/IEtleWJvYXJkQmFzZS5jb2Rlcy5pbmRleE9mKGJhc2UpIDogS2V5Ym9hcmRCYXNlLmVycm9ySWR4O1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGlzSWR4VmFsaWQoaWR4Om51bWJlcik6Ym9vbGVhbiB7XG4gICAgICByZXR1cm4gIWlzTmFOKGlkeCkgJiYgIShpZHggPCAwKSB8fCAhKGlkeCA+PSBLZXlib2FyZEJhc2UuY29kZXMubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpc0NvZGVWYWxpZChiYXNlOnN0cmluZyk6Ym9vbGVhbiB7XG4gICAgICByZXR1cm4gdHlwZW9mIChiYXNlKSA9PT0gJ3N0cmluZycgJiYgS2V5Ym9hcmRCYXNlLmNvZGVzLmluZGV4T2YoYmFzZSkgIT09IC0xO1xuICAgIH1cbiAgfVxufVxuIiwiY2xhc3MgTWVzc2FnZVR5cGUge1xuXHRuYW1lOnN0cmluZztcblx0aWQ6bnVtYmVyO1xuXG5cdGNvbnN0cnVjdG9yKG5hbWU6c3RyaW5nLCBpZDpudW1iZXIpIHtcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xuXHRcdHRoaXMuaWQgPSBpZDtcblx0fVxuXG5cdHN0YXRpYyB1bmtub3duOk1lc3NhZ2VUeXBlID0gbmV3IE1lc3NhZ2VUeXBlKCdVbmtub3duJywgMCk7XG5cdHN0YXRpYyBOZXdTdGVwQ3JlYXRlZDpNZXNzYWdlVHlwZSA9IG5ldyBNZXNzYWdlVHlwZSgnTmV3U3RlcENyZWF0ZWQnLCAxKTtcblx0c3RhdGljIFJlY2lwZUNoYW5nZWQ6TWVzc2FnZVR5cGUgPSBuZXcgTWVzc2FnZVR5cGUoJ1JlY2lwZUNoYW5nZWQnLCAyKTtcblx0c3RhdGljIEFza0luZ3JlZGllbnQ6TWVzc2FnZVR5cGUgPSBuZXcgTWVzc2FnZVR5cGUoJ0Fza0luZ3JlZGllbnQnLCAzKTtcblx0c3RhdGljIEFuc3dlckluZ3JlZGllbnQ6TWVzc2FnZVR5cGUgPSBuZXcgTWVzc2FnZVR5cGUoJ0Fuc3dlckluZ3JlZGllbnQnLCA0KTtcblx0c3RhdGljIFNob3dTaG9ydGN1dHM6TWVzc2FnZVR5cGUgPSBuZXcgTWVzc2FnZVR5cGUoJ1Nob3dTaG9ydGN1dHMnLCA1KTtcblx0c3RhdGljIENyZWF0ZVN0ZXA6TWVzc2FnZVR5cGUgPSBuZXcgTWVzc2FnZVR5cGUoJ0NyZWF0ZVN0ZXAnLCA2KTtcblx0c3RhdGljIENhbmNlbDpNZXNzYWdlVHlwZSA9IG5ldyBNZXNzYWdlVHlwZSgnQ3JlYXRlU3RlcCcsIDcpO1xuXHRzdGF0aWMgQXNrTWVudTpNZXNzYWdlVHlwZSA9IG5ldyBNZXNzYWdlVHlwZSgnQXNrTWVudScsIDgpO1xuXHRzdGF0aWMgQW5zd2VyTWVudTpNZXNzYWdlVHlwZSA9IG5ldyBNZXNzYWdlVHlwZSgnQW5zd2VyTWVudScsIDkpO1xuXHRzdGF0aWMgQXNrVGV4dDpNZXNzYWdlVHlwZSA9IG5ldyBNZXNzYWdlVHlwZSgnQXNrVGV4dCcsIDEwKTtcblx0c3RhdGljIEFuc3dlclRleHQ6TWVzc2FnZVR5cGUgPSBuZXcgTWVzc2FnZVR5cGUoJ0Fuc3dlclRleHQnLCAxMSk7XG5cdHN0YXRpYyBBc2tRdWFudGl0eTpNZXNzYWdlVHlwZSA9IG5ldyBNZXNzYWdlVHlwZSgnQXNrUXVhbnRpdHknLCAxMik7XG5cdHN0YXRpYyBBbnN3ZXJRdWFudGl0eTpNZXNzYWdlVHlwZSA9IG5ldyBNZXNzYWdlVHlwZSgnQW5zd2VyUXVhbnRpdHknLCAxMyk7XG5cdHN0YXRpYyBTZXJ2ZXJDb25uZWN0ZWQ6TWVzc2FnZVR5cGUgPSBuZXcgTWVzc2FnZVR5cGUoJ1NlcnZlckNvbm5lY3RlZCcsIDE0KTtcblx0c3RhdGljIFVuc3VjY2Vzc2Z1bENvbm5lY3Rpb246TWVzc2FnZVR5cGUgPSBuZXcgTWVzc2FnZVR5cGUoJ1Vuc3VjY2Vzc2Z1bENvbm5lY3Rpb24nLCAxNSk7XG5cdHN0YXRpYyBJbnZlbnRvcnlDaGFuZ2VkOk1lc3NhZ2VUeXBlID0gbmV3IE1lc3NhZ2VUeXBlKCdJbnZlbnRvcnlDaGFuZ2VkJywgMTYpO1xuXHRzdGF0aWMgU3RhdHVzVXBkYXRlOk1lc3NhZ2VUeXBlID0gbmV3IE1lc3NhZ2VUeXBlKCdTdGF0dXNVcGRhdGUnLCAxNyk7XG59OyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJtZXNzYWdlVHlwZS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGVmcy9lczYtcHJvbWlzZS9lczYtcHJvbWlzZS5kLnRzXCIgLz5cblxuaW50ZXJmYWNlIEhhbmRsZXJGdW5jIHtcblx0KGRhdGE6IGFueSk6IHZvaWQ7XG59XG5cbmNsYXNzIFN1c2NyaWJlciB7XG5cdG9iajogT2JqZWN0O1xuXHRmbjogSGFuZGxlckZ1bmM7XG5cdHR5cGU6IE1lc3NhZ2VUeXBlO1xufVxuXG5jbGFzcyBFdmVudEJ1cyB7XG5cdHByaXZhdGUgYnlUeXBlOiB7IFt0eXBlOm51bWJlcl06IEFycmF5PFN1c2NyaWJlcj4gfSA9IHt9O1xuXHRcblx0LyoqXG5cdCAqIFdoZW4gdHJ1ZSB0aGUgYnVzIHdpbGwgbG9nIGFsbCBldmVudHMgb24gdGhlIGNvbnNvbGUuXG5cdCAqL1xuXHRpc0xvZ2dpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblx0XG5cdC8qKlxuXHQgKiBTZW5kcyBhbiBldmVudCB0byBhbGwgcG90ZW50aWFsIHN1c2NyaWJlcnNcblx0ICogQHBhcmFtIHR5cGUgVHlwZSBvZiB0aGUgZXZlbnQgZnJvbSBFdmVudFR5cGVcblx0ICogQHBhcmFtIGRhdGEgQW55IHJlbGV2YW50IGRhdGEuXG5cdCAqL1xuXHRwdWJsaXNoKHR5cGU6IE1lc3NhZ2VUeXBlLCBkYXRhPzogYW55KSB7XG5cdFx0KHRoaXMuYnlUeXBlW3R5cGUuaWRdIHx8IFtdKVxuXHRcdFx0LmZvckVhY2goKGhhbmRsZXIpID0+IHsgdGhpcy50cmlnZ2VyKGhhbmRsZXIsIGRhdGEpOyB9KTtcblx0XHR0aGlzLmxvZyh0eXBlLCBkYXRhKTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIFN1c2NyaWJlIHRvIGEgdHlwZSBvZiBldmVudHMuXG5cdCAqIEBwYXJhbSBoYW5kbGVyIE9iamVjdCB0aGF0IHdpbGwgaGFuZGxlIHRoZSBtZXNzYWdlLlxuXHQgKiBAcGFyYW0gdHlwZXMgVHlwZXMgb2YgbWVzc2FnZSB0byByZWdpc3RlciB0by5cblx0ICovXG5cdHN1c2NyaWJlKHR5cGU6IE1lc3NhZ2VUeXBlLCBjYWxsYmFjazogSGFuZGxlckZ1bmMsIG9wdFRoaXM6IE9iamVjdCkge1xuXHRcdHRoaXMuYnlUeXBlW3R5cGUuaWRdID0gdGhpcy5ieVR5cGVbdHlwZS5pZF0gfHwgW107XG5cdFx0dGhpcy5ieVR5cGVbdHlwZS5pZF0ucHVzaCh7XG5cdFx0XHRvYmo6IG9wdFRoaXMgfHwgV2luZG93LFxuXHRcdFx0Zm46IGNhbGxiYWNrLFxuXHRcdFx0dHlwZTogdHlwZVxuXHRcdH0pO1xuXHR9XG5cdFxuXHQvKipcblx0ICogUHVibGlzaCBhIG1lc3NhZ2UgYW5kIHdhaXRzIGZvciBhbiBhbnN3ZXIuIFxuXHQgKi9cblx0cHVibGlzaEFuZFdhaXRGb3Iod2FpdEZvclR5cGU6IE1lc3NhZ2VUeXBlLCBwdWJsaXNoVHlwZTogTWVzc2FnZVR5cGUsIGRhdGE/OiBhbnkpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0dGhpcy5zdXNjcmliZSh3YWl0Rm9yVHlwZSwgKGRhdGEpID0+IHsgcmVzb2x2ZShkYXRhKTsgfSwgdGhpcyk7XG5cdFx0XHR0aGlzLnB1Ymxpc2gocHVibGlzaFR5cGUsIGRhdGEpO1xuXHRcdH0pO1xuXHR9XG5cdFxuXHRwcml2YXRlIGxvZyh0eXBlOiBNZXNzYWdlVHlwZSwgZGF0YTogYW55KSB7XG5cdFx0aWYgKHRoaXMuaXNMb2dnaW5nKSBjb25zb2xlLmxvZygnW0V2ZW50QnVzXScsIHR5cGUsIGRhdGEpO1xuXHR9XG5cdHByaXZhdGUgdHJpZ2dlcihoYW5kbGVyOiBTdXNjcmliZXIsIGRhdGE6IGFueSkge1xuXHRcdGhhbmRsZXIuZm4uY2FsbChoYW5kbGVyLm9iaiwgZGF0YSk7XG5cdH1cbn1cblxudmFyIGJ1cyA9IG5ldyBFdmVudEJ1cygpOyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9iYXNlL2NvbmNlcHRSZWYudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImRpbWVuc2lvbi50c1wiIC8+XG5cbmNsYXNzIFVuaXQge1xuXHRjb25jZXB0OiBDb25jZXB0UmVmO1xuXHRzeW1ib2w6c3RyaW5nO1xuXHRvZmZzZXQ6bnVtYmVyO1xuXHRtdWx0aXBsaWVyOm51bWJlcjtcblx0ZGltZW5zaW9uOiBEaW07XG5cdHN5c3RlbTogVW5pdFN5c3RlbTtcblxuXHRjb25zdHJ1Y3Rvcihjb25jZXB0OkNvbmNlcHRSZWYsIHN5bWJvbDpzdHJpbmcsIG9mZnNldDpudW1iZXIsIG11bHRpcGxpZXI6bnVtYmVyLCBkaW06RGltLCBzeXN0ZW06VW5pdFN5c3RlbSkge1xuXHRcdHRoaXMuY29uY2VwdCA9IGNvbmNlcHQ7XG5cdFx0dGhpcy5zeW1ib2wgPSBzeW1ib2w7XG5cdFx0dGhpcy5vZmZzZXQgPSBvZmZzZXQ7XG5cdFx0dGhpcy5tdWx0aXBsaWVyID0gbXVsdGlwbGllcjtcblx0XHR0aGlzLmRpbWVuc2lvbiA9IGRpbTtcblx0XHR0aGlzLnN5c3RlbSA9IHN5c3RlbTtcblx0fVxuXHRcblx0dG9TdHJpbmcoKSA6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHRoaXMuY29uY2VwdCArICcoJyArIHRoaXMuc3ltYm9sICsgJyknO1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyBVbmtub3duID0gbmV3IFVuaXQoT250b1JlZi5jcmVhdGVBbm9uKCd1bmtub3duVW5pdCcpLCAnJywgMCwgMCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi91bml0cy91bml0LnRzXCIgLz5cblxuY2xhc3MgUXVhbnRpdHkge1xuXHRtYWduaXR1ZGU6IG51bWJlcjtcblx0dW5pdDogVW5pdDtcblx0XG5cdGNvbnN0cnVjdG9yKG1hZ25pdHVkZTogbnVtYmVyLCB1bml0OiBVbml0KSB7XG5cdFx0dGhpcy5tYWduaXR1ZGUgPSBtYWduaXR1ZGU7XG5cdFx0dGhpcy51bml0ID0gdW5pdDtcdFxuXHR9XG5cdFxuXHR0b1N0cmluZygpIDogc3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy5tYWduaXR1ZGUgKyAnICcgKyB0aGlzLnVuaXQuc3ltYm9sO1xuXHR9XG59IiwiY2xhc3MgTGlzdE5vZGUge1xuXHRwYXlsb2FkOiBhbnk7XG5cdG5leHQ6IExpc3ROb2RlO1xuXHRsYXN0OiBMaXN0Tm9kZTtcblx0XG5cdGNvbnN0cnVjdG9yKHBheWxvYWQ6YW55KSB7XG5cdFx0dGhpcy5wYXlsb2FkID0gcGF5bG9hZDtcblx0XHR0aGlzLm5leHQgPSBudWxsO1xuXHRcdHRoaXMubGFzdCA9IG51bGw7XG5cdH1cdFx0XG59XG5cbmNsYXNzIExpc3Qge1xuXHRiZWdpbjogTGlzdE5vZGU7XG5cdGVuZDogTGlzdE5vZGU7XG5cdHB1c2gocGF5bG9hZDphbnkpIHtcblx0XHR2YXIgbmV3Tm9kZSA9IG5ldyBMaXN0Tm9kZShwYXlsb2FkKTtcblx0ICAgIGlmICh0aGlzLmVuZCA9PT0gbnVsbCkge1xuXHQgICAgICB0aGlzLmJlZ2luID0gbmV3Tm9kZTtcblx0ICAgICAgdGhpcy5lbmQgPSBuZXdOb2RlO1xuXHQgICAgICByZXR1cm4gdGhpcztcblx0ICAgIH1cblx0ICAgIHRoaXMuZW5kLm5leHQgPSBuZXdOb2RlO1xuXHQgICAgbmV3Tm9kZS5sYXN0ID0gdGhpcy5lbmQ7XG5cdCAgICB0aGlzLmVuZCA9IG5ld05vZGU7XG5cdH1cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vYmFzZS9ldmVudEJ1cy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vYmFzZS9tZXNzYWdlVHlwZS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vZGVmcy9lczYtcHJvbWlzZS9lczYtcHJvbWlzZS5kLnRzXCIgLz5cblxuLyoqXG4gKiBTZXJ2ZXIgcHJveHkgb2JqZWN0IHdoaWNoIHNlcnZlcyBhcyBhbiBPYmplY3QgdGhhdCBjb3VsZCBiZSBxdWVyaWVkIGZyb20gSlMuXG4gKi9cbmludGVyZmFjZSBTZXJ2ZXIge1xuICAvKiogV2hldGhlciBhIHNlcnZlciBpcyBjb25uZWN0ZWQuIENhbiBiZSBudWxsLiAqL1xuICBpc0Nvbm5lY3RlZDogQm9vbGVhbjtcblxuICBlbmRwb2ludCgpOiBzdHJpbmc7XG4gIHN5bmNJbnZlbnRvcnkoKTogUHJvbWlzZTxPYmplY3Q+O1xufVxuXG5jbGFzcyBTZXJ2ZXJJbXBsIHtcbiAgLyoqIFdoZXRoZXIgYSBzZXJ2ZXIgaXMgY29ubmVjdGVkLiBDYW4gYmUgbnVsbC4gKi9cbiAgcHVibGljIGlzQ29ubmVjdGVkOiBCb29sZWFuID0gbnVsbDtcblxuICBwcml2YXRlIHdzOiBXZWJTb2NrZXQ7XG4gIHByaXZhdGUgdXJsOiBzdHJpbmc7XG4gIHByaXZhdGUgY2xpZW50SWQ6IHN0cmluZztcbiAgcHJpdmF0ZSBwYWNrZXRJZENvdW50ZXI6IG51bWJlcjtcbiAgcHJpdmF0ZSB0aW1lb3V0TXM6IG51bWJlcjtcbiAgcHJpdmF0ZSBjb21tdW5pY2F0aW9uczogeyBbaWQ6IG51bWJlcl06ICh2YWx1ZT86IE9iamVjdCB8IFRoZW5hYmxlPE9iamVjdD4pID0+IHZvaWQ7IH07XG5cbiAgcHVibGljIGVuZHBvaW50KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudXJsO1xuICB9XG5cbiAgcHVibGljIHN5bmNJbnZlbnRvcnkoKTogUHJvbWlzZTxPYmplY3Q+IHtcbiAgICB2YXIgcGFja2V0ID0ge1xuICAgICAgdHlwZTogJ3N5bmNJbnZlbnRvcnknLFxuICAgICAgZGF0YTogPE9iamVjdD5udWxsLFxuICAgICAgaWQ6IHRoaXMucGFja2V0SWRDb3VudGVyLFxuICAgICAgY2xpZW50SWQ6IHRoaXMuY2xpZW50SWRcbiAgICB9O1xuXG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgdGhpcy5jb21tdW5pY2F0aW9uc1t0aGlzLnBhY2tldElkQ291bnRlcl0gPSByZXNvbHZlO1xuICAgIH0pO1xuXG4gICAgdGhpcy5wYWNrZXRJZENvdW50ZXIrKztcbiAgICBjb25zb2xlLmluZm8oJ3NlcnZlci5zZW5kJywgcGFja2V0KTtcbiAgICB0aGlzLndzLnNlbmQoSlNPTi5zdHJpbmdpZnkocGFja2V0KSk7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yYWNlKFtcbiAgICAgIG5ldyBQcm9taXNlKChfLCByZWplY3QpID0+IHsgc2V0VGltZW91dChyZWplY3QsIHRoaXMudGltZW91dE1zKTsgfSksXG4gICAgICBwcm9taXNlXG4gICAgXSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZW5kcG9pbnQ6IHN0cmluZykge1xuICAgIGlmIChlbmRwb2ludCA9PT0gdW5kZWZpbmVkKVxuICAgICAgcmV0dXJuO1xuICAgIHRoaXMudXJsID0gZW5kcG9pbnQ7XG4gICAgdGhpcy5wYWNrZXRJZENvdW50ZXIgPSAwO1xuICAgIHRoaXMudGltZW91dE1zID0gNTAwO1xuICAgIHRoaXMuY2xpZW50SWQgPSBcInVpZDAwMDAxXCI7XG4gICAgdHJ5IHtcbiAgICAgICAgdGhpcy53cyA9IG5ldyBXZWJTb2NrZXQodGhpcy51cmwpOyAgXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InLCBlKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5jb21tdW5pY2F0aW9ucyA9IHt9O1xuXG4gICAgdGhpcy53cy5vbmNsb3NlID0gdGhpcy5fb25DbG9zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMud3Mub25lcnJvciA9IHRoaXMuX29uRXJyb3IuYmluZCh0aGlzKTtcbiAgICB0aGlzLndzLm9ubWVzc2FnZSA9IHRoaXMuX29uTWVzc2FnZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMud3Mub25vcGVuID0gdGhpcy5fb25PcGVuLmJpbmQodGhpcyk7XG4gIH1cblxuICBwcml2YXRlIF9vbkNsb3NlKCkge1xuICAgIGlmICh0aGlzLmlzQ29ubmVjdGVkID09PSBudWxsKVxuICAgICAgYnVzLnB1Ymxpc2goTWVzc2FnZVR5cGUuVW5zdWNjZXNzZnVsQ29ubmVjdGlvbik7XG4gIH1cblxuICBwcml2YXRlIF9vbkVycm9yKCkge1xuXG4gIH1cblxuICBwcml2YXRlIF9vbk1lc3NhZ2UobXNnOiBNZXNzYWdlRXZlbnQpIHtcbiAgICB0cnkge1xuICAgICAgdmFyIHBrZyA9IEpTT04ucGFyc2UobXNnLmRhdGEpO1xuICAgICAgY29uc29sZS5pbmZvKCdzZXJ2ZXIucmVjZWl2ZWQnLCBwa2cpO1xuICAgICAgdmFyIGNhbGxiYWNrID0gdGhpcy5jb21tdW5pY2F0aW9uc1twa2cuaWRdO1xuICAgICAgaWYgKGNhbGxiYWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2FsbGJhY2socGtnLmRhdGEpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS53YXJuKCdFcnJvciBwYXJzaW5nICcgKyBlcnIubWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfb25PcGVuKCkge1xuICAgIGJ1cy5wdWJsaXNoKE1lc3NhZ2VUeXBlLlNlcnZlckNvbm5lY3RlZCk7XG4gIH1cbn0iLCJlbnVtIEl0ZW1UeXBlIHtcbiAgRmVybWVudGFibGVzLFxuICBIb3BzLFxuICBZZWFzdHMsXG4gIE1pc2NlbGxhbmVvdXMsXG4gIER5bmFtaWNzXG59OyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJpdGVtLnRzXCIgLz5cblxuY2xhc3MgU3RvY2sge1xuICBpdGVtOiBJdGVtO1xuICBxdWFudGl0eTogUXVhbnRpdHk7XG4gIGJvdWdodE9uOiBEYXRlO1xuICBwcm92aWRlcjogU3RyaW5nO1xuXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVJhdyhpdGVtOiBJdGVtLCByYXc6IGFueSk6IFN0b2NrIHtcbiAgICB2YXIgcyA9IG5ldyBTdG9jaygpO1xuICAgIHMuaXRlbSA9IGl0ZW07XG4gICAgcy5xdWFudGl0eSA9IHJhdy5xdWFudGl0eTtcbiAgICBzLmJvdWdodE9uID0gbmV3IERhdGUocmF3LmJvdWdodE9uKTtcbiAgICBzLnByb3ZpZGVyID0gcmF3LnByb3ZpZGVyO1xuICAgIHJldHVybiBzO1xuICB9XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2Jhc2UvY29uY2VwdFJlZi50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdW5pdHMvZGltZW5zaW9uLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJpdGVtVHlwZS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic3RvY2sudHNcIiAvPlxuXG5jbGFzcyBJdGVtIHtcbiAgdHlwZTogSXRlbVR5cGU7XG4gIG5hbWU6IHN0cmluZztcbiAgcmVmOiBzdHJpbmc7XG4gIHN0b2NrczogU3RvY2tbXTtcblxuICBwdWJsaWMgc3RhdGljIGZyb21SYXcocmF3OiBhbnkpOiBJdGVtIHtcbiAgICB2YXIgaSA6IEl0ZW0gPSBuZXcgSXRlbSgpO1xuXG4gICAgc3dpdGNoKHJhdy50eXBlKSB7XG4gICAgICBjYXNlICdGZXJtZW50YWJsZXMnOlxuICAgICAgICBpLnR5cGUgPSBJdGVtVHlwZS5GZXJtZW50YWJsZXM7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnSG9wcyc6XG4gICAgICAgIGkudHlwZSA9IEl0ZW1UeXBlLkhvcHM7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnWWVhc3RzJzpcbiAgICAgICAgaS50eXBlID0gSXRlbVR5cGUuWWVhc3RzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ01pc2NlbGxhbmVvdXMnOlxuICAgICAgICBpLnR5cGUgPSBJdGVtVHlwZS5NaXNjZWxsYW5lb3VzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0R5bmFtaWNzJzpcbiAgICAgICAgaS50eXBlID0gSXRlbVR5cGUuRHluYW1pY3M7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpLm5hbWUgPSByYXcubmFtZTtcbiAgICBpLnJlZiA9IHJhdy5yZWY7XG4gICAgaS5zdG9ja3MgPSByYXcuc3RvY2tzLm1hcCgoczogYW55KSA9PiB7IHJldHVybiBTdG9jay5mcm9tUmF3KGksIHMpOyB9KTtcbiAgICByZXR1cm4gaTtcbiAgfVxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJpdGVtLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJpdGVtVHlwZS50c1wiIC8+XG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9iYXNlL2V2ZW50QnVzLnRzXCIgLz5cbi8qKlxuICogVGhlIGludmVudG9yeSBpcyBhIGNvbGxlY3Rpb24gb2YgaXRlbXMgaGF2aW5nIHR5cGVzIGFuZCB3aGljaCBjYW4gYmUgcGFydCBvZiBzdG9ja3MuXG4gKlxuICogRmVybWVudGFibGVzLCBmb3IgZXhhbXBsZXMsIGlzIGEgdHlwZSBvZiBpdGVtcy4gQSBjZXJ0YWluIHF1YW50aXR5IG9mIGFuIGl0ZW0sIHB1cmNoYXNlZFxuICogYXQgYSBjZXJ0YWluIHRpbWUsIGZyb20gYSBjZXJ0YWluIHN1cHBsaWVyIGlzIGEgc3RvY2suXG4gKi9cbmNsYXNzIEludmVudG9yeSB7XG4gIHByaXZhdGUgaXRlbXM6IEl0ZW1bXTtcbiAgcHJpdmF0ZSBzdG9ja3M6IFN0b2NrW107XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pdGVtcyA9IFtdO1xuICAgIHRoaXMuc3RvY2tzID0gW107XG4gIH1cblxuICBwdWJsaWMgbGlzdEl0ZW0odHlwZT86IEl0ZW1UeXBlKSB7XG4gICAgaWYgKHR5cGUgPT09IHVuZGVmaW5lZClcbiAgICAgIHJldHVybiB0aGlzLml0ZW1zO1xuICAgIHJldHVybiB0aGlzLml0ZW1zLmZpbHRlcigoaSkgPT4geyByZXR1cm4gaS50eXBlID09PSB0eXBlOyB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRJdGVtKGl0ZW06IEl0ZW0pIHtcbiAgICB0aGlzLml0ZW1zLnB1c2goaXRlbSk7XG4gICAgaXRlbS5zdG9ja3MuZm9yRWFjaCgocykgPT4geyB0aGlzLnN0b2Nrcy5wdXNoKHMpOyB9KVxuICAgIGJ1cy5wdWJsaXNoKE1lc3NhZ2VUeXBlLkludmVudG9yeUNoYW5nZWQpO1xuICB9XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImRpbWVuc2lvbi50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwidW5pdC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vYmFzZS9jb25jZXB0UmVmLnRzXCIgLz5cblxuY2xhc3MgU3lzdGVtSW1wbCB7XG4gIHByaXZhdGUgdW5pdHM6IEFycmF5PFVuaXQ+ID0gW107XG4gIG5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihuYW1lOnN0cmluZywgdW5pdHM6IEFycmF5PFVuaXQ+KSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnVuaXRzID0gdW5pdHM7XG4gICAgdGhpcy51bml0cy5mb3JFYWNoKCh1OiBVbml0KSA9PiB7IHUuc3lzdGVtID0gdGhpczsgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzeW0oc3ltYm9sOnN0cmluZykgOiBVbml0IHtcbiAgICByZXR1cm4gdGhpcy51bml0cy5maWx0ZXIodSA9PiB1LnN5bWJvbCA9PT0gc3ltYm9sKVswXTtcbiAgfVxuXG4gIGRpbShkaW06IERpbSkgOiBBcnJheTxVbml0PiB7XG4gICAgcmV0dXJuIHRoaXMudW5pdHMuZmlsdGVyKHUgPT4gdS5kaW1lbnNpb24gPT09IGRpbSk7XG4gIH1cbiAgXG4gIGdldEJ5SWQoaWQ6IHN0cmluZykgOiBVbml0IHtcbiAgICB2YXIgbWF0Y2g6IFVuaXRbXSA9IHRoaXMudW5pdHMuZmlsdGVyKCh1OiBVbml0KSA9PiB7IHJldHVybiB1LmNvbmNlcHQucmVmID09PSBpZDsgfSk7XG4gICAgcmV0dXJuIG1hdGNoLmxlbmd0aCA9PT0gMCA/IG51bGwgOiBtYXRjaFswXTtcbiAgfVxufVxuXG5jbGFzcyBVbml0U3lzdGVtIHtcbiAgcHVibGljIHN0YXRpYyBTSSA9IG5ldyBTeXN0ZW1JbXBsKCdTSScsIFtcbiAgICBuZXcgVW5pdChuZXcgT250b1JlZignYnJldzprZycsICdraWxvZ3JhbScpLCAna2cnLCAwLCAxLCBEaW0uTWFzcywgbnVsbCksXG4gICAgbmV3IFVuaXQobmV3IE9udG9SZWYoJ2JyZXc6bGl0ZXInLCAnbGl0ZXInKSwgJ2wnLCAwLCAxLCBEaW0uVm9sdW1lLCBudWxsKSxcbiAgICBuZXcgVW5pdChuZXcgT250b1JlZignYnJldzprZWx2aW4nLCAna2VsdmluJyksICdLJywgMCwgMSwgRGltLlRlbXBlcmF0dXJlLCBudWxsKSxcbiAgICBuZXcgVW5pdChuZXcgT250b1JlZignYnJldzpjZWxzaXVzJywgJ2NlbHNpdXMnKSwgJ0MnLCAwLCAxLCBEaW0uVGVtcGVyYXR1cmUsIG51bGwpLFxuICAgIG5ldyBVbml0KG5ldyBPbnRvUmVmKCdicmV3Om1pbnV0ZScsICdtaW51dGUnKSwgJ21pbicsIDAsIDEsIERpbS5UZW1wb3JhbCwgbnVsbClcbiAgXSk7XG4gIHB1YmxpYyBzdGF0aWMgVXNDdXN0ID0gbmV3IFN5c3RlbUltcGwoJ1VzIEN1c3QuJywgW1xuICAgICAgbmV3IFVuaXQobmV3IE9udG9SZWYoJ2JyZXc6aW5jaCcsICdpbmNoJyksICdpbicsIDAsIDEsIERpbS5MZW5ndGgsIG51bGwpLFxuICAgICAgbmV3IFVuaXQobmV3IE9udG9SZWYoJ2JyZXc6cGludCcsICdwaW50JyksICdwdCcsIDAsIDEsIERpbS5Wb2x1bWUsIG51bGwpLFxuICAgICAgbmV3IFVuaXQobmV3IE9udG9SZWYoJ2JyZXc6Y3VwJywgJ2N1cCcpLCAnY3VwJywgMCwgMSwgRGltLlZvbHVtZSwgbnVsbCksXG4gICAgICBuZXcgVW5pdChuZXcgT250b1JlZignYnJldzp0c3AnLCAndGVhc3Bvb24nKSwgJ3RzcCcsIDAsIDEsIERpbS5Wb2x1bWUsIG51bGwpLFxuICAgICAgbmV3IFVuaXQobmV3IE9udG9SZWYoJ2JyZXc6ZmFyZW5oZWl0JywgJ2ZhcmVuaGVpdCcpLCAnRicsIDAsIDEsIERpbS5UZW1wZXJhdHVyZSwgbnVsbClcbiAgXSk7XG4gIHB1YmxpYyBzdGF0aWMgSW1wZXJpYWwgPSBuZXcgU3lzdGVtSW1wbCgnSW1wZXJpYWwnLCBbXG4gIF0pO1xuICBcbiAgcHVibGljIHN0YXRpYyBhbGwoKSA6IEFycmF5PFN5c3RlbUltcGw+IHsgcmV0dXJuIFt0aGlzLlNJLCB0aGlzLlVzQ3VzdCwgdGhpcy5JbXBlcmlhbF07IH1cbiAgXG4gIHB1YmxpYyBzdGF0aWMgZ2V0VW5pdChpZDogc3RyaW5nKSA6IFVuaXQge1xuICAgIHZhciBtYXRjaDogVW5pdFtdID0gdGhpcy5hbGwoKVxuICAgICAgLm1hcCgoc3lzdGVtOlN5c3RlbUltcGwsIGlkeDogbnVtYmVyLCBhcnI6IFN5c3RlbUltcGxbXSkgPT4ge1xuICAgICAgICByZXR1cm4gc3lzdGVtLmdldEJ5SWQoaWQpXG4gICAgICB9KVxuICAgICAgLmZpbHRlcigodW5pdDogVW5pdCkgPT4ge1xuICAgICAgICByZXR1cm4gdW5pdCAhPT0gbnVsbDtcbiAgICAgIH0pO1xuICAgIHJldHVybiBtYXRjaC5sZW5ndGggPT09IDAgPyBudWxsIDogbWF0Y2hbMF07XG4gIH1cbn1cblxudmFyXG4gIFNJOiBTeXN0ZW1JbXBsID0gVW5pdFN5c3RlbS5TSSxcbiAgVXNDdXN0OiBTeXN0ZW1JbXBsID0gVW5pdFN5c3RlbS5Vc0N1c3QsXG4gIEltcGVyaWFsOiBTeXN0ZW1JbXBsID0gVW5pdFN5c3RlbS5JbXBlcmlhbDsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
