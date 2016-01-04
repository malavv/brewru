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
    MessageType.Cancel = new MessageType('Cancel', 7);
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
    MessageType.RecipeSelected = new MessageType('RecipeSelected', 18);
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
        this.isLogging = true;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UvY29uY2VwdFJlZi50cyIsImVudGl0aWVzLnRzIiwiZXJyb3JzLnRzIiwidW5pdHMvZGltZW5zaW9uLnRzIiwic3VwcGx5L2luZ3JlZGllbnQudHMiLCJpbmdyZWRpZW50U3JjLnRzIiwic3RlcC50cyIsInJlYWN0b3IudHMiLCJpbmdyZWRpZW50cy50cyIsInJlY2lwZS50cyIsImJhc2Uva2V5Ym9hcmQudHMiLCJzaG9ydGN1dHMudHMiLCJiYXNlL2NvZGVzLnRzIiwiYmFzZS9tZXNzYWdlVHlwZS50cyIsImJhc2UvZXZlbnRCdXMudHMiLCJ1bml0cy91bml0LnRzIiwiYmFzZS9xdWFudGl0eS50cyIsImNvbGxlYy9saXN0LnRzIiwic2VydmVyL3NlcnZlci50cyIsInN1cHBseS9pdGVtVHlwZS50cyIsInN1cHBseS9zdG9jay50cyIsInN1cHBseS9pdGVtLnRzIiwic3VwcGx5L2ludmVudG9yeS50cyIsInVuaXRzL3N5c3RlbS50cyJdLCJuYW1lcyI6WyJPbnRvUmVmIiwiT250b1JlZi5jb25zdHJ1Y3RvciIsIk9udG9SZWYudG9TdHJpbmciLCJPbnRvUmVmLmNyZWF0ZUFub24iLCJPbnRvUmVmLmNyZWF0ZSIsIkVudGl0aWVzIiwiRW50aXRpZXMuY29uc3RydWN0b3IiLCJDYW5jZWxFcnJvciIsIkNhbmNlbEVycm9yLmNvbnN0cnVjdG9yIiwiVW5pbXBsZW1lbnRlZEVycm9yIiwiVW5pbXBsZW1lbnRlZEVycm9yLmNvbnN0cnVjdG9yIiwiSW52YWxpZFN0YXRlRXJyb3IiLCJJbnZhbGlkU3RhdGVFcnJvci5jb25zdHJ1Y3RvciIsIkRpbSIsIkRpbS5jb25zdHJ1Y3RvciIsIkRpbS5hbGwiLCJTdXBwbHkiLCJTdXBwbHkuSW5nVHlwZSIsIlN1cHBseS5JbmdUeXBlLmNvbnN0cnVjdG9yIiwiU3VwcGx5LkluZ1R5cGUuYWxsIiwiU3VwcGx5LkluZ1R5cGUub2YiLCJTdXBwbHkuSW5nVHlwZS50b1N0cmluZyIsIlN1cHBseS5CYXNlSW5nIiwiU3VwcGx5LkJhc2VJbmcuY29uc3RydWN0b3IiLCJTdXBwbHkuQmFzZUluZy50eXBlIiwiU3VwcGx5LkJhc2VJbmcuZGltZW5zaW9ucyIsIlN1cHBseS5CYXNlSW5nLnRvU3RyaW5nIiwiU3VwcGx5LkluZyIsIlN1cHBseS5JbmcuY29uc3RydWN0b3IiLCJTdXBwbHkuSW5nLnRvU3RyaW5nIiwiSW5ncmVkaWVudFNyYyIsIkluZ3JlZGllbnRTcmMuY29uc3RydWN0b3IiLCJJbmdyZWRpZW50U3JjLmFkZEFsbCIsIlN0ZXAiLCJTdGVwLmNvbnN0cnVjdG9yIiwiU3RlcC50b1N0cmluZyIsIlN0ZXBUeXBlIiwiU3RlcFR5cGUuY29uc3RydWN0b3IiLCJSZWFjdG9yIiwiUmVhY3Rvci5jb25zdHJ1Y3RvciIsIlJlYWN0b3IuYWRkQWZ0ZXIiLCJSZWFjdG9yLmNyZWF0ZUFub24iLCJSZWFjdG9yLmlzUmVhY3RvciIsIlJlYWN0b3IubmV4dElkIiwiSW5ncmVkaWVudHMiLCJJbmdyZWRpZW50cy5jb25zdHJ1Y3RvciIsIkluZ3JlZGllbnRzLmxpc3RBbGxJbmdyZWRpZW50cyIsIkluZ3JlZGllbnRzLmdldEZyb21JbnZlbnRvcnkiLCJJbmdyZWRpZW50cy5hZGRUb0ludmVudG9yeSIsIkluZ3JlZGllbnRzLmFkZFNyYyIsIlJlY2lwZSIsIlJlY2lwZS5jb25zdHJ1Y3RvciIsIlJlY2lwZS5hZGRSZWFjdG9yIiwiUmVjaXBlLmxpc3REeW5hbWljSW5ncmVkaWVudHMiLCJSZWNpcGUuX2dldE91dHB1dCIsIlJlY2lwZS5lbmNvZGUiLCJSZWNpcGUuZGVjb2RlIiwiUmVjaXBlLl9kZWNvZGVSZWFjdG9yIiwiUmVjaXBlLl9kZWNvZGVTdGVwIiwiUmVjaXBlLl9kZWNvZGVSZWYiLCJLZXlib2FyZCIsIktleWJvYXJkLmNvbnN0cnVjdG9yIiwiS2V5Ym9hcmQudG9TdHJpbmciLCJLZXlib2FyZC5mcm9tRXZ0IiwiS2V5Ym9hcmQuZ2V0S2V5QmluZGluZyIsIktleWJvYXJkLmdldENvZGVOYW1lIiwiU2hvcnRjdXQiLCJTaG9ydGN1dC5jb25zdHJ1Y3RvciIsIlNob3J0Y3V0cyIsIlNob3J0Y3V0cy5jb25zdHJ1Y3RvciIsIlNob3J0Y3V0cy5oYXNLZXkiLCJTaG9ydGN1dHMuZ2V0IiwiU2hvcnRjdXRzLmFkZCIsImJhc2UiLCJiYXNlLktleWJvYXJkQmFzZSIsImJhc2UuS2V5Ym9hcmRCYXNlLmNvbnN0cnVjdG9yIiwiYmFzZS5LZXlib2FyZEJhc2UudG9Db2RlIiwiYmFzZS5LZXlib2FyZEJhc2UudG9JZHgiLCJiYXNlLktleWJvYXJkQmFzZS5pc0lkeFZhbGlkIiwiYmFzZS5LZXlib2FyZEJhc2UuaXNDb2RlVmFsaWQiLCJNZXNzYWdlVHlwZSIsIk1lc3NhZ2VUeXBlLmNvbnN0cnVjdG9yIiwiU3VzY3JpYmVyIiwiU3VzY3JpYmVyLmNvbnN0cnVjdG9yIiwiRXZlbnRCdXMiLCJFdmVudEJ1cy5jb25zdHJ1Y3RvciIsIkV2ZW50QnVzLnB1Ymxpc2giLCJFdmVudEJ1cy5zdXNjcmliZSIsIkV2ZW50QnVzLnB1Ymxpc2hBbmRXYWl0Rm9yIiwiRXZlbnRCdXMubG9nIiwiRXZlbnRCdXMudHJpZ2dlciIsIlVuaXQiLCJVbml0LmNvbnN0cnVjdG9yIiwiVW5pdC50b1N0cmluZyIsIlF1YW50aXR5IiwiUXVhbnRpdHkuY29uc3RydWN0b3IiLCJRdWFudGl0eS50b1N0cmluZyIsIkxpc3ROb2RlIiwiTGlzdE5vZGUuY29uc3RydWN0b3IiLCJMaXN0IiwiTGlzdC5jb25zdHJ1Y3RvciIsIkxpc3QucHVzaCIsIlNlcnZlckltcGwiLCJTZXJ2ZXJJbXBsLmNvbnN0cnVjdG9yIiwiU2VydmVySW1wbC5lbmRwb2ludCIsIlNlcnZlckltcGwuc3luY0ludmVudG9yeSIsIlNlcnZlckltcGwuX29uQ2xvc2UiLCJTZXJ2ZXJJbXBsLl9vbkVycm9yIiwiU2VydmVySW1wbC5fb25NZXNzYWdlIiwiU2VydmVySW1wbC5fb25PcGVuIiwiSXRlbVR5cGUiLCJTdG9jayIsIlN0b2NrLmNvbnN0cnVjdG9yIiwiU3RvY2suZnJvbVJhdyIsIkl0ZW0iLCJJdGVtLmNvbnN0cnVjdG9yIiwiSXRlbS5mcm9tUmF3IiwiSW52ZW50b3J5IiwiSW52ZW50b3J5LmNvbnN0cnVjdG9yIiwiSW52ZW50b3J5Lmxpc3RJdGVtIiwiSW52ZW50b3J5LmFkZEl0ZW0iLCJTeXN0ZW1JbXBsIiwiU3lzdGVtSW1wbC5jb25zdHJ1Y3RvciIsIlN5c3RlbUltcGwuc3ltIiwiU3lzdGVtSW1wbC5kaW0iLCJTeXN0ZW1JbXBsLmdldEJ5SWQiLCJVbml0U3lzdGVtIiwiVW5pdFN5c3RlbS5jb25zdHJ1Y3RvciIsIlVuaXRTeXN0ZW0uYWxsIiwiVW5pdFN5c3RlbS5nZXRVbml0Il0sIm1hcHBpbmdzIjoiQUFNQTtJQU1FQSxpQkFBWUEsR0FBVUEsRUFBRUEsSUFBV0E7UUFDakNDLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLElBQUlBLE9BQU9BLEdBQUdBLE9BQU9BLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO1FBQ2xEQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUNqQkEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsR0FBR0EsS0FBS0EsSUFBSUEsQ0FBQ0E7SUFDN0JBLENBQUNBO0lBRURELDBCQUFRQSxHQUFSQSxjQUFxQkUsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFFakNGLGtCQUFVQSxHQUFqQkEsVUFBa0JBLElBQVdBLElBQWlCRyxNQUFNQSxDQUFDQSxJQUFJQSxPQUFPQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUN4RUgsY0FBTUEsR0FBYkEsVUFBY0EsR0FBVUEsRUFBRUEsSUFBV0EsSUFBaUJJLE1BQU1BLENBQUNBLElBQUlBLE9BQU9BLENBQUNBLEdBQUdBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0lBZHZFSixtQkFBV0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7SUFlakNBLGNBQUNBO0FBQURBLENBaEJBLEFBZ0JDQSxJ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akNBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLEtBQUtBLFNBQVNBLENBQUNBO1lBQ3pCQSxNQUFNQSxDQUFDQTtRQUNUQSxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUNwQkEsSUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDekJBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLEdBQUdBLENBQUNBO1FBQ3JCQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxVQUFVQSxDQUFDQTtRQUMzQkEsSUFBSUEsQ0FBQ0E7WUFDREEsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsSUFBSUEsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDdENBLENBQUVBO1FBQUFBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ1RBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1FBQzVCQSxDQUFDQTtRQUVEQSxJQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUV6QkEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDM0NBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBQzNDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUMvQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7SUFDM0NBLENBQUNBO0lBbERNRCw2QkFBUUEsR0FBZkE7UUFDRUUsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7SUFDbEJBLENBQUNBO0lBRU1GLGtDQUFhQSxHQUFwQkE7UUFBQUcsaUJBeUJDQTtRQXhCQ0EsSUFBSUEsTUFBTUEsR0FBR0E7WUFDWEEsSUFBSUEsRUFBRUEsZUFBZUE7WUFDckJBLElBQUlBLEVBQVVBLElBQUlBO1lBQ2xCQSxFQUFFQSxFQUFFQSxJQUFJQSxDQUFDQSxlQUFlQTtZQUN4QkEsUUFBUUEsRUFBRUEsSUFBSUEsQ0FBQ0EsUUFBUUE7U0FDeEJBLENBQUNBO1FBRUZBLElBQUlBLE9BQU9BLEdBQUdBLElBQUlBLE9BQU9BLENBQUNBLFVBQUNBLE9BQU9BO1lBQ2hDQSxLQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxLQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxHQUFHQSxPQUFPQSxDQUFDQTtRQUN0REEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFFSEEsSUFBSUEsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0E7UUFDdkJBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBO1FBQ3BDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUVyQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0E7WUFDbEJBLElBQUlBLE9BQU9BLENBQUNBLFVBQUNBLENBQUNBLEVBQUVBLE1BQU1BLElBQU9BLFVBQVVBLENBQUNBLE1BQU1BLEVBQUVBLEtBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ25FQSxPQUFPQTtTQUNSQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFDQSxJQUFJQTtZQUNYQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUNkQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxVQUFDQSxLQUFLQTtZQUNiQSxNQUFNQSxLQUFLQSxDQUFDQTtZQUNaQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUNkQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUNMQSxDQUFDQTtJQXVCT0gsNkJBQVFBLEdBQWhCQTtRQUNFSSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxLQUFLQSxJQUFJQSxDQUFDQTtZQUM1QkEsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsQ0FBQ0Esc0JBQXNCQSxDQUFDQSxDQUFDQTtJQUNwREEsQ0FBQ0E7SUFFT0osNkJBQVFBLEdBQWhCQTtJQUVBSyxDQUFDQTtJQUVPTCwrQkFBVUEsR0FBbEJBLFVBQW1CQSxHQUFpQkE7UUFDbENNLElBQUlBLENBQUNBO1lBQ0hBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQy9CQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxpQkFBaUJBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO1lBQ3JDQSxJQUFJQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUMzQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsS0FBS0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzNCQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNyQkEsQ0FBQ0E7UUFDSEEsQ0FBRUE7UUFBQUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDYkEsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtRQUMvQ0EsQ0FBQ0E7SUFDSEEsQ0FBQ0E7SUFFT04sNEJBQU9BLEdBQWZBO1FBQ0VPLEdBQUdBLENBQUNBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO0lBQzNDQSxDQUFDQTtJQUNIUCxpQkFBQ0E7QUFBREEsQ0F4RkEsQUF3RkNBLElBQUE7QUN2R0QsSUFBSyxRQU1KO0FBTkQsV0FBSyxRQUFRO0lBQ1hRLHVEQUFZQSxDQUFBQTtJQUNaQSx1Q0FBSUEsQ0FBQUE7SUFDSkEsMkNBQU1BLENBQUFBO0lBQ05BLHlEQUFhQSxDQUFBQTtJQUNiQSwrQ0FBUUEsQ0FBQUE7QUFDVkEsQ0FBQ0EsRUFOSSxRQUFRLEtBQVIsUUFBUSxRQU1aO0FBQUEsQ0FBQztBQ05GLGdDQUFnQztBQUVoQztJQUFBQztJQWNBQyxDQUFDQTtJQVJlRCxhQUFPQSxHQUFyQkEsVUFBc0JBLElBQVVBLEVBQUVBLEdBQVFBO1FBQ3hDRSxJQUFJQSxDQUFDQSxHQUFHQSxJQUFJQSxLQUFLQSxFQUFFQSxDQUFDQTtRQUNwQkEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDZEEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsR0FBR0EsR0FBR0EsQ0FBQ0EsUUFBUUEsQ0FBQ0E7UUFDMUJBLENBQUNBLENBQUNBLFFBQVFBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1FBQ3BDQSxDQUFDQSxDQUFDQSxRQUFRQSxHQUFHQSxHQUFHQSxDQUFDQSxRQUFRQSxDQUFDQTtRQUMxQkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDWEEsQ0FBQ0E7SUFDSEYsWUFBQ0E7QUFBREEsQ0FkQSxBQWNDQSxJQUFBO0FDaEJELDhDQUE4QztBQUM5Qyw4Q0FBOEM7QUFDOUMsb0NBQW9DO0FBQ3BDLGlDQUFpQztBQUVqQztJQUFBRztJQStCQUMsQ0FBQ0E7SUF6QmVELFlBQU9BLEdBQXJCQSxVQUFzQkEsR0FBUUE7UUFDNUJFLElBQUlBLENBQUNBLEdBQVVBLElBQUlBLElBQUlBLEVBQUVBLENBQUNBO1FBRTFCQSxNQUFNQSxDQUFBQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNoQkEsS0FBS0EsY0FBY0E7Z0JBQ2pCQSxDQUFDQSxDQUFDQSxJQUFJQSxHQUFHQSxRQUFRQSxDQUFDQSxZQUFZQSxDQUFDQTtnQkFDL0JBLEtBQUtBLENBQUNBO1lBQ1JBLEtBQUtBLE1BQU1BO2dCQUNUQSxDQUFDQSxDQUFDQSxJQUFJQSxHQUFHQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQTtnQkFDdkJBLEtBQUtBLENBQUNBO1lBQ1JBLEtBQUtBLFFBQVFBO2dCQUNYQSxDQUFDQSxDQUFDQSxJQUFJQSxHQUFHQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQTtnQkFDekJBLEtBQUtBLENBQUNBO1lBQ1JBLEtBQUtBLGVBQWVBO2dCQUNsQkEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsR0FBR0EsUUFBUUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7Z0JBQ2hDQSxLQUFLQSxDQUFDQTtZQUNSQSxLQUFLQSxVQUFVQTtnQkFDYkEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsR0FBR0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7Z0JBQzNCQSxLQUFLQSxDQUFDQTtRQUNWQSxDQUFDQTtRQUNEQSxDQUFDQSxDQUFDQSxJQUFJQSxHQUFHQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUNsQkEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0E7UUFDaEJBLENBQUNBLENBQUNBLE1BQU1BLEdBQUdBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLFVBQUNBLENBQU1BLElBQU9BLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQ3ZFQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUNYQSxDQUFDQTtJQUNIRixXQUFDQTtBQUFEQSxDQS9CQSxBQStCQ0EsSUFBQTtBQ3BDRCxnQ0FBZ0M7QUFDaEMsb0NBQW9DO0FBRXBDLDRDQUE0QztBQUM1Qzs7Ozs7R0FLRztBQUNIO0lBSUVHO1FBQ0VDLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLEVBQUVBLENBQUNBO1FBQ2hCQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxFQUFFQSxDQUFDQTtJQUNuQkEsQ0FBQ0E7SUFFTUQsNEJBQVFBLEdBQWZBLFVBQWdCQSxJQUFlQTtRQUM3QkUsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsU0FBU0EsQ0FBQ0E7WUFDckJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBO1FBQ3BCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFDQSxDQUFDQSxJQUFPQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxLQUFLQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUMvREEsQ0FBQ0E7SUFFTUYsMkJBQU9BLEdBQWRBLFVBQWVBLElBQVVBO1FBQXpCRyxpQkFJQ0E7UUFIQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDdEJBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLFVBQUNBLENBQUNBLElBQU9BLEtBQUlBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUFBO1FBQ3BEQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxDQUFDQSxnQkFBZ0JBLENBQUNBLENBQUNBO0lBQzVDQSxDQUFDQTtJQUNISCxnQkFBQ0E7QUFBREEsQ0FwQkEsQUFvQkNBLElBQUE7QUM5QkQscUNBQXFDO0FBQ3JDLGdDQUFnQztBQUNoQyw4Q0FBOEM7QUFFOUM7SUFJRUksb0JBQVlBLElBQVdBLEVBQUVBLEtBQWtCQTtRQUo3Q0MsaUJBdUJDQTtRQXRCU0EsVUFBS0EsR0FBZ0JBLEVBQUVBLENBQUNBO1FBSTlCQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUNqQkEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDbkJBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLFVBQUNBLENBQU9BLElBQU9BLENBQUNBLENBQUNBLE1BQU1BLEdBQUdBLEtBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQ3REQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNkQSxDQUFDQTtJQUVERCx3QkFBR0EsR0FBSEEsVUFBSUEsTUFBYUE7UUFDZkUsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsVUFBQUEsQ0FBQ0EsSUFBSUEsT0FBQUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsS0FBS0EsTUFBTUEsRUFBbkJBLENBQW1CQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUN4REEsQ0FBQ0E7SUFFREYsd0JBQUdBLEdBQUhBLFVBQUlBLEdBQVFBO1FBQ1ZHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLFVBQUFBLENBQUNBLElBQUlBLE9BQUFBLENBQUNBLENBQUNBLFNBQVNBLEtBQUtBLEdBQUdBLEVBQW5CQSxDQUFtQkEsQ0FBQ0EsQ0FBQ0E7SUFDckRBLENBQUNBO0lBRURILDRCQUFPQSxHQUFQQSxVQUFRQSxFQUFVQTtRQUNoQkksSUFBSUEsS0FBS0EsR0FBV0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsVUFBQ0EsQ0FBT0EsSUFBT0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsS0FBS0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDckZBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEtBQUtBLENBQUNBLEdBQUdBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNB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QUFPQSxDQUFDQSxVQUFVQSxFQUFFQSxLQUFLQSxDQUFDQSxFQUFFQSxLQUFLQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxNQUFNQSxFQUFFQSxJQUFJQSxDQUFDQTtRQUN2RUEsSUFBSUEsSUFBSUEsQ0FBQ0EsSUFBSUEsT0FBT0EsQ0FBQ0EsVUFBVUEsRUFBRUEsVUFBVUEsQ0FBQ0EsRUFBRUEsS0FBS0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsQ0FBQ0E7UUFDNUVBLElBQUlBLElBQUlBLENBQUNBLElBQUlBLE9BQU9BLENBQUNBLGdCQUFnQkEsRUFBRUEsV0FBV0EsQ0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsV0FBV0EsRUFBRUEsSUFBSUEsQ0FBQ0E7S0FDekZBLENBQUNBLENBQUNBO0lBQ1dBLG1CQUFRQSxHQUFHQSxJQUFJQSxVQUFVQSxDQUFDQSxVQUFVQSxFQUFFQSxFQUNuREEsQ0FBQ0EsQ0FBQ0E7SUFjTEEsaUJBQUNBO0FBQURBLENBOUJBLEFBOEJDQSxJQUFBO0FBRUQsSUFDRSxFQUFFLEdBQWUsVUFBVSxDQUFDLEVBQUUsRUFDOUIsTUFBTSxHQUFlLFVBQVUsQ0FBQyxNQUFNLEVBQ3RDLFFBQVEsR0FBZSxVQUFVLENBQUMsUUFBUSxDQUFDIiwiZmlsZSI6ImJyZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbnRlcmZhY2UgQ29uY2VwdFJlZiB7XG4gIGlzQW5vbjogYm9vbGVhbjtcbiAgcmVmOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbn1cblxuY2xhc3MgT250b1JlZiBpbXBsZW1lbnRzIENvbmNlcHRSZWYge1xuICBwcml2YXRlIHN0YXRpYyBuZXh0QW5vblJlZiA9IDA7XG4gIHJlZjogc3RyaW5nO1xuICBpc0Fub246IGJvb2xlYW47XG4gIG5hbWU6IHN0cmluZztcbiAgXG4gIGNvbnN0cnVjdG9yKHJlZjpzdHJpbmcsIG5hbWU6c3RyaW5nKSB7XG4gICAgdGhpcy5yZWYgPSByZWYgfHwgJ2Fub246JyArIE9udG9SZWYubmV4dEFub25SZWYrKztcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuaXNBbm9uID0gcmVmID09PSBudWxsOyAgICBcbiAgfVxuICBcbiAgdG9TdHJpbmcoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMubmFtZTsgfVxuICBcbiAgc3RhdGljIGNyZWF0ZUFub24obmFtZTpzdHJpbmcpIDogQ29uY2VwdFJlZiB7IHJldHVybiBuZXcgT250b1JlZihudWxsLCBuYW1lKTsgfVxuICBzdGF0aWMgY3JlYXRlKHJlZjpzdHJpbmcsIG5hbWU6c3RyaW5nKSA6IENvbmNlcHRSZWYgeyByZXR1cm4gbmV3IE9udG9SZWYocmVmLCBuYW1lKTsgfVxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlL2NvbmNlcHRSZWYudHNcIiAvPlxuXG5jbGFzcyBFbnRpdGllcyB7XG4gICAgc3RhdGljIHRhcFdhdGVyOiBDb25jZXB0UmVmID0gbmV3IE9udG9SZWYoJ2JyZXc6dGFwV2F0ZXInLCAnVGFwIFdhdGVyJyk7XG4gICAgc3RhdGljIGludmVudG9yeTogQ29uY2VwdFJlZiA9IG5ldyBPbnRvUmVmKCdicmV3OnBlcnNvbmFsSW52ZW50b3J5JywgJ1BlcnNvbmFsIEludmVudG9yeScpO1xuICAgIHN0YXRpYyBrZzogQ29uY2VwdFJlZiA9IG5ldyBPbnRvUmVmKCd1bml0OmtpbG9ncmFtJywgJ2tpbG9ncmFtJyk7XG4gICAgc3RhdGljIGxpdGVyOiBDb25jZXB0UmVmID0gbmV3IE9udG9SZWYoJ3VuaXQ6bGl0ZXInLCAnbGl0ZXInKTtcbiAgICBzdGF0aWMgc3lydXA6IENvbmNlcHRSZWYgPSBuZXcgT250b1JlZignYnJldzpicmV3ZXJzU3lyb3AnLCAnQnJld2VyXFwncyBTeXJ1cCcpO1xuICAgIHN0YXRpYyBkbWU6IENvbmNlcHRSZWYgPSBuZXcgT250b1JlZignYnJldzpkbWUnLCAnRHJ5IE1hbHQgRXh0cmFjdCcpO1xuICAgIHN0YXRpYyBjMTIwOiBDb25jZXB0UmVmID0gbmV3IE9udG9SZWYoJ2JyZXc6Y3J5c3RhbDEyMCcsICdDcnlzdGFsIDEyMCcpO1xuICAgIHN0YXRpYyBjNjA6IENvbmNlcHRSZWYgPSBuZXcgT250b1JlZignYnJldzpjcnlzdGFsNjAnLCAnQ3J5c3RhbCA2MCcpO1xuICAgIHN0YXRpYyBwYWxlQ2hvY286IENvbmNlcHRSZWYgPSBuZXcgT250b1JlZignYnJldzpQYWxlQ2hvY29sYXRlJywgJ1BhbGUgQ2hvY29sYXRlJyk7XG4gICAgc3RhdGljIGJsYWNrTWFsdDogQ29uY2VwdFJlZiA9IG5ldyBPbnRvUmVmKCdicmV3OkJsYWNrTWFsdCcsICdCbGFjayBNYWx0Jyk7XG4gICAgc3RhdGljIGZsYWtlZFJ5ZTogQ29uY2VwdFJlZiA9IG5ldyBPbnRvUmVmKCdicmV3OkZsYWtlZFJ5ZScsICdGbGFrZWQgUnllJyk7XG4gICAgc3RhdGljIHJvbGxlZE9hdDogQ29uY2VwdFJlZiA9IG5ldyBPbnRvUmVmKCdicmV3OlJvbGxlZE9hdCcsICdSb2xsZWQgT2F0Jyk7XG4gICAgXG4gICAgc3RhdGljIHllYXN0TnV0cmllbnQ6IENvbmNlcHRSZWYgPSBuZXcgT250b1JlZignYnJldzp5ZWFzdE51dHJpZW50JywgJ1llYXN0IE51dHJpZW50Jyk7XG4gICAgXG4gICAgc3RhdGljIHcyMTEyOiBDb25jZXB0UmVmID0gbmV3IE9udG9SZWYoJ2JyZXc6dzIxMTInLCAnV3llYXN0IENhbGlmb3JuaWEgTGFnZXInKTtcbn0iLCJjbGFzcyBDYW5jZWxFcnJvciBpbXBsZW1lbnRzIEVycm9yIHtcbiAgbmFtZTogc3RyaW5nID0gJ0NhbmNlbCc7XG4gIG1lc3NhZ2U6IHN0cmluZyA9ICdPcGVyYXRpb24gaGFzIGJlZW4gY2FuY2VsbGVkLic7XG59XG5jbGFzcyBVbmltcGxlbWVudGVkRXJyb3IgaW1wbGVtZW50cyBFcnJvciB7XG4gIG5hbWU6IHN0cmluZyA9ICdVbmltcGxlbWVudGVkJztcbiAgbWVzc2FnZTogc3RyaW5nID0gJ09wZXJhdGlvbiBub3QgeWV0IGltcGxlbWVudGVkLic7XG59XG5jbGFzcyBJbnZhbGlkU3RhdGVFcnJvciBpbXBsZW1lbnRzIEVycm9yIHtcbiAgbmFtZTogc3RyaW5nID0gJ0ludmFsaWRTdGF0ZSc7XG4gIG1lc3NhZ2U6IHN0cmluZyA9ICdJbnZhbGlkIHN0YXRlIHJlYWNoZWQuJztcbn0iLCIvKipcbiAqIFJlcHJlc2VudHMgYSB1bml0IGRpbWVuc2lvbi5cbiAqIFxuICogV2hldGhlciBpdCBpcyBhIHVuaXQgb2YgbWFzcywgYSB1bml0IG9mIGxlbmd0aCwgLi4uXG4gKi9cbmNsYXNzIERpbSB7XG5cdHB1YmxpYyBzdGF0aWMgTGVuZ3RoID0gbmV3IERpbSgpO1xuXHRwdWJsaWMgc3RhdGljIE1hc3MgPSBuZXcgRGltKCk7XG5cdHB1YmxpYyBzdGF0aWMgVGVtcGVyYXR1cmUgPSBuZXcgRGltKCk7XG5cdHB1YmxpYyBzdGF0aWMgVm9sdW1lID0gbmV3IERpbSgpO1xuXHRwdWJsaWMgc3RhdGljIFRlbXBvcmFsID0gbmV3IERpbSgpO1xuXHRcblx0cHVibGljIHN0YXRpYyBhbGwoKSB7IHJldHVybiBbRGltLkxlbmd0aCwgRGltLk1hc3MsIERpbS5UZW1wZXJhdHVyZSwgRGltLlZvbHVtZV07IH1cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vYmFzZS9jb25jZXB0UmVmLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi91bml0cy9kaW1lbnNpb24udHNcIiAvPlxuXG5tb2R1bGUgU3VwcGx5IHtcblx0ZXhwb3J0IGNsYXNzIEluZ1R5cGUge1xuXHRcdHB1YmxpYyBzdGF0aWMgRmVybWVudGFibGUgPSBuZXcgSW5nVHlwZSgnZmVybWVudGFibGUnKTtcblx0XHRwdWJsaWMgc3RhdGljIEhvcHMgPSBuZXcgSW5nVHlwZSgnaG9wcycpO1xuXHRcdHB1YmxpYyBzdGF0aWMgWWVhc3QgPSBuZXcgSW5nVHlwZSgneWVhc3QnKTtcblx0XHRwdWJsaWMgc3RhdGljIE1pc2NlbGxhbmVvdXMgID0gbmV3IEluZ1R5cGUoJ21pc2NlbGxhbmVvdXMnKTtcblx0XHRwdWJsaWMgc3RhdGljIER5bmFtaWMgPSBuZXcgSW5nVHlwZSgnZHluYW1pYycpO1xuXHRcdHB1YmxpYyBzdGF0aWMgYWxsKCkge1xuXHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0SW5nVHlwZS5GZXJtZW50YWJsZSxcblx0XHRcdFx0SW5nVHlwZS5Ib3BzLFxuXHRcdFx0XHRJbmdUeXBlLlllYXN0LFxuXHRcdFx0XHRJbmdUeXBlLk1pc2NlbGxhbmVvdXMsXG5cdFx0XHRcdEluZ1R5cGUuRHluYW1pY1xuXHRcdFx0XTtcblx0XHR9XG5cdFx0XG5cdFx0cHVibGljIG5hbWU6IHN0cmluZztcblx0XHRcblx0XHRjb25zdHJ1Y3RvcihuYW1lIDogc3RyaW5nKSB7XG5cdFx0XHR0aGlzLm5hbWUgPSBuYW1lO1xuXHRcdH1cblx0XHRcblx0XHRwdWJsaWMgc3RhdGljIG9mKG5hbWU6IHN0cmluZykgOiBJbmdUeXBlIHtcblx0XHRcdHZhciBmb3VuZCA9IEluZ1R5cGUuYWxsKCkuZmlsdGVyKHQgPT4gdC5uYW1lID09PSBuYW1lKTtcblx0XHRcdHJldHVybiBmb3VuZC5sZW5ndGggPT09IDEgPyBmb3VuZFswXSA6IG51bGw7XG5cdFx0fVxuXHRcdFxuXHRcdHB1YmxpYyB0b1N0cmluZygpIDogc3RyaW5nIHtcblx0XHRcdHJldHVybiB0aGlzLm5hbWU7XG5cdFx0fVxuXHR9XG5cdFxuXHQvKipcblx0ICogUmVwcmVzZW50cyB0aGUgYWJzdHJhY3QgY29uY2VwdCBvZiBjZXJ0YWluIGluZ3JlZGllbnQuXG5cdCAqIFxuXHQgKiBGb3IgZXhhbXBsZSwgSGFsbGVydGF1ZXIgaXMgYSBiYXNlIGluZ3JlZGllbnQgYnV0IEhhbGxlcnRhdWVyICh1cylcblx0ICogZnJvbSBhIGNlcnRhaW4gcGxhY2UgYW5kIGhhdmluZyBhIGNlcnRhaW4gQUEgaXMgYSBJbmdyZWRpZW50LlxuXHQgKi9cblx0ZXhwb3J0IGNsYXNzIEJhc2VJbmcge1xuXHRcdHByaXZhdGUgX3R5cGU6IEluZ1R5cGU7XG5cdFx0cHJpdmF0ZSBfZGltZW5zaW9uczogQXJyYXk8RGltPjtcblx0XHRcblx0XHRwdWJsaWMgcmVmOiBDb25jZXB0UmVmO1xuXHRcdFxuXHRcdGNvbnN0cnVjdG9yKGNvbmNlcHQ6IENvbmNlcHRSZWYsIHR5cGU6IEluZ1R5cGUsIGRpbWVuc2lvbnM6IEFycmF5PERpbT4gPSBbXSkge1xuXHRcdFx0dGhpcy5yZWYgPSBjb25jZXB0O1xuXHRcdFx0dGhpcy5fdHlwZSA9IHR5cGU7XG5cdFx0XHR0aGlzLl9kaW1lbnNpb25zID0gZGltZW5zaW9ucztcblx0XHR9XG5cdFx0XG5cdFx0cHVibGljIHR5cGUoKSA6IEluZ1R5cGUgeyByZXR1cm4gdGhpcy5fdHlwZTsgfVxuXHRcdHB1YmxpYyBkaW1lbnNpb25zKCkgOiBBcnJheTxEaW0+IHsgcmV0dXJuIHRoaXMuX2RpbWVuc2lvbnM7IH1cblx0XHRwdWJsaWMgdG9TdHJpbmcoKSA6IHN0cmluZyB7IHJldHVybiB0aGlzLnJlZi5uYW1lOyB9XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBSZXByZXNlbnQgYW4gaW5ncmVkaWVudCBidXQgbm90IGl0cyBhc3NvY2lhdGVkIHN1cHBsaWVzLlxuXHQgKi9cblx0ZXhwb3J0IGNsYXNzIEluZyBleHRlbmRzIEJhc2VJbmcge1xuXHRcdGNvbnN0cnVjdG9yKGNvbmNlcHQ6IENvbmNlcHRSZWYsIHR5cGU6IEluZ1R5cGUsIGRpbWVuc2lvbnM6IEFycmF5PERpbT4gPSBbXSkge1xuXHRcdFx0c3VwZXIoY29uY2VwdCwgdHlwZSwgZGltZW5zaW9ucyk7XG5cdFx0fVxuXHRcdHB1YmxpYyB0b1N0cmluZygpIDogc3RyaW5nIHsgcmV0dXJuIHRoaXMucmVmLm5hbWU7IH1cblx0fVx0XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UvY29uY2VwdFJlZi50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic3VwcGx5L2luZ3JlZGllbnRcIiAvPlxuXG5jbGFzcyBJbmdyZWRpZW50U3JjIHtcblx0Y29uY2VwdDogQ29uY2VwdFJlZjtcblx0c3RvY2tzOiBBcnJheTxTdXBwbHkuSW5nPjtcblx0XG5cdGNvbnN0cnVjdG9yKGNvbmNlcHQgOiBDb25jZXB0UmVmKSB7XG5cdFx0dGhpcy5jb25jZXB0ID0gY29uY2VwdDtcblx0XHR0aGlzLnN0b2NrcyA9IFtdO1xuXHR9XG5cdFxuXHRhZGRBbGwoaXRlbXMgOiBBcnJheTxTdXBwbHkuSW5nPikge1xuXHRcdHRoaXMuc3RvY2tzID0gdGhpcy5zdG9ja3MuY29uY2F0KGl0ZW1zKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlL2NvbmNlcHRSZWYudHNcIiAvPlxuXG4vKiogVGhpcyB3aWxsIG5lZWQgdG8gYmUgcmV2aWV3ZWQgd2l0aCBzcGVjaWZpYyBzdWItY2xhc3Nlcy4gKi9cbmNsYXNzIFN0ZXAge1xuXG5cdHByaXZhdGUgc3RhdGljIGlkeCA9IDA7XG5cblx0cHVibGljIGlkOiBzdHJpbmc7XG5cdHB1YmxpYyBuYW1lOiBzdHJpbmc7XG5cdHB1YmxpYyB0eXBlOiBDb25jZXB0UmVmXG5cblx0Y29uc3RydWN0b3IobmFtZTogc3RyaW5nLCB0eXBlOiBDb25jZXB0UmVmLCBpZDogc3RyaW5nID0gJ2Fub246JyArIFN0ZXAuaWR4KyspIHtcblx0XHR0aGlzLmlkID0gaWQ7XG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcblx0XHR0aGlzLnR5cGUgPSB0eXBlO1xuXHR9XG5cblx0cHVibGljIHRvU3RyaW5nKCkgOiBzdHJpbmcge1xuXHRcdHJldHVybiB0aGlzLm5hbWU7XG5cdH1cbn1cblxuLyoqXG4gKiBTdGVwIHR5cGUgb2JqZWN0IGZvciBlYXN5IGF1dG9jb21wbGV0ZS5cbiAqXG4gKiBTaG91bGQgYmUgZmlsbGVkIGZyb20gdGhlIG9udG9sb2d5IGFuZCBzaG91bGQgYmUgdXNlZCB1c2luZyB0aGUgU3RlcCBvYmplY3QuXG4gKi9cbmNsYXNzIFN0ZXBUeXBlIHtcblx0cHVibGljIHN0YXRpYyBhZGRJbmdyZWRpZW50OiBDb25jZXB0UmVmID0gT250b1JlZi5jcmVhdGVBbm9uKCdBZGQgSW5ncmVkaWVudCcpO1xuXHRwdWJsaWMgc3RhdGljIGRlZmluZU91dHB1dDogQ29uY2VwdFJlZiA9IE9udG9SZWYuY3JlYXRlQW5vbignRGVmaW5lIE91dHB1dCcpO1xuXHRwdWJsaWMgc3RhdGljIGZlcm1lbnQ6IENvbmNlcHRSZWYgPSBPbnRvUmVmLmNyZWF0ZUFub24oJ0Zlcm1lbnQnKTtcblx0cHVibGljIHN0YXRpYyBoZWF0aW5nOiBDb25jZXB0UmVmID0gT250b1JlZi5jcmVhdGVBbm9uKCdDaGFuZ2Ugb2YgVGVtcC4nKTtcblx0cHVibGljIHN0YXRpYyBtZXJnaW5nOiBDb25jZXB0UmVmID0gT250b1JlZi5jcmVhdGVBbm9uKCdNZXJnaW5nJyk7XG5cdHB1YmxpYyBzdGF0aWMgc3BsaXR0aW5nOiBDb25jZXB0UmVmID0gT250b1JlZi5jcmVhdGVBbm9uKCdTcGxpdHRpbmcnKTtcblxuXHQvLyBTaG91bGQgbm90IGJlIGluIGFsbCwgc2luY2Ugc2VudGluZWwgc3RlcC5cblx0c3RhdGljIHN0YXJ0OiBDb25jZXB0UmVmID0gT250b1JlZi5jcmVhdGVBbm9uKCdTdGFydCcpO1xuXG5cdHN0YXRpYyBBbGwgOiBBcnJheTxDb25jZXB0UmVmPiA9IFtcblx0XHRcdFN0ZXBUeXBlLmFkZEluZ3JlZGllbnQsXG5cdFx0XHRTdGVwVHlwZS5kZWZpbmVPdXRwdXQsXG5cdFx0XHRTdGVwVHlwZS5mZXJtZW50LFxuXHRcdFx0U3RlcFR5cGUuaGVhdGluZyxcblx0XHRcdFN0ZXBUeXBlLm1lcmdpbmcsXG5cdFx0XHRTdGVwVHlwZS5zcGxpdHRpbmdcblx0XTtcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiaW5ncmVkaWVudFNyYy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic3RlcC50c1wiIC8+XG5cbmNsYXNzIFJlYWN0b3Ige1xuXHRwcml2YXRlIHN0YXRpYyBuZXh0SWR4Om51bWJlciA9IDA7XG5cdFxuXHRwdWJsaWMgaWQ6IG51bWJlcjtcblx0cHVibGljIG5hbWU6IHN0cmluZztcblx0cHVibGljIHN0ZXBzOiBBcnJheTxTdGVwPjtcblx0XG5cdGNvbnN0cnVjdG9yKGlkOiBudW1iZXIgPSAwLCBuYW1lOiBzdHJpbmcgPSAnQW5vbnltb3VzJywgc3RlcHM6IEFycmF5PFN0ZXA+ID0gW25ldyBTdGVwKCdzdGFydCcsIFN0ZXBUeXBlLnN0YXJ0KV0pIHtcblx0XHR0aGlzLmlkID0gaWQ7XG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcblx0XHR0aGlzLnN0ZXBzID0gc3RlcHM7XG5cdH1cblx0XG5cdHB1YmxpYyBhZGRBZnRlcihsaHM6IGFueSwgbmV3T2JqOiBhbnkpIHtcblx0XHRpZiAobmV3T2JqLnRpbWluZyA9PT0gJ0FmdGVyJykge1xuICAgICAgXHRcdHZhciBpZHggPSB0aGlzLnN0ZXBzLmluZGV4T2YobGhzKTtcbiAgICAgIFx0XHR0aGlzLnN0ZXBzLnNwbGljZShpZHggKyAxLCAwLCBuZXcgU3RlcCgnQW5vbnltb3VzJywgbnVsbCkpO1xuICAgIFx0fVxuXHR9XG5cdFxuXHRwdWJsaWMgc3RhdGljIGNyZWF0ZUFub24oKSB7XG5cdFx0cmV0dXJuIG5ldyBSZWFjdG9yKFJlYWN0b3IubmV4dElkeCk7XG5cdH1cblx0cHVibGljIHN0YXRpYyBpc1JlYWN0b3IocmVhY3RvcjogUmVhY3Rvcikge1xuXHRcdHJldHVybiByZWFjdG9yLmlkICE9PSB1bmRlZmluZWQgXG5cdFx0XHQmJiByZWFjdG9yLnN0ZXBzICE9PSB1bmRlZmluZWQgXG5cdFx0XHQmJiBBcnJheS5pc0FycmF5KHJlYWN0b3Iuc3RlcHMpO1xuXHR9XG5cdHByaXZhdGUgc3RhdGljIG5leHRJZCgpIHtcblx0XHRyZXR1cm4gJ3JlYWN0b3I6JyArIFJlYWN0b3IubmV4dElkeCsrO1xuXHR9XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInJlYWN0b3IudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UvY29uY2VwdFJlZi50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic3VwcGx5L2luZ3JlZGllbnRcIiAvPlxuXG5jbGFzcyBJbmdyZWRpZW50cyB7XG5cdGludmVudG9yeTogQXJyYXk8U3VwcGx5LkluZz4gPSBbXTtcblx0cmVhY3RvcnM6IEFycmF5PFJlYWN0b3I+ID0gW107XG5cdFxuXHRsaXN0QWxsSW5ncmVkaWVudHMoKSB7XG5cdFx0cmV0dXJuIFtdLmNvbmNhdCh0aGlzLmludmVudG9yeSk7XG5cdH1cblx0XG5cdGdldEZyb21JbnZlbnRvcnkoY29uY2VwdDogQ29uY2VwdFJlZikge1xuXHRcdHJldHVybiB0aGlzLmludmVudG9yeS5maWx0ZXIoKGkpID0+IHsgcmV0dXJuIGkucmVmID09PSBjb25jZXB0OyB9KTtcblx0fVxuXHRcblx0YWRkVG9JbnZlbnRvcnkoaW5ncmVkaWVudDogU3VwcGx5LkluZykge1xuXHRcdHRoaXMuaW52ZW50b3J5LnB1c2goaW5ncmVkaWVudCk7XG5cdH1cblx0YWRkU3JjKHJlYWN0b3I6IFJlYWN0b3IpIHtcblx0XHRpZiAodGhpcy5yZWFjdG9ycy5zb21lKChzKSA9PiB7IHJldHVybiBzLmlkID09IHJlYWN0b3IuaWQ7IH0pKVxuXHRcdCAgcmV0dXJuO1xuXHRcdHRoaXMucmVhY3RvcnMucHVzaChyZWFjdG9yKTtcblx0fVxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJyZWFjdG9yLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzdXBwbHkvaW5ncmVkaWVudC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiZW50aXRpZXMudHNcIiAvPlxuXG5jbGFzcyBSZWNpcGUge1xuICBuYW1lOiBzdHJpbmc7XG4gIHJlYWN0b3JzOiBBcnJheTxSZWFjdG9yPjtcblx0XG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZyA9ICdBbm9ueW1vdXMnLCByZWFjdG9yczogQXJyYXk8UmVhY3Rvcj4gPSBbUmVhY3Rvci5jcmVhdGVBbm9uKCldKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnJlYWN0b3JzID0gcmVhY3RvcnM7XG4gIH1cblx0XG4gIGFkZFJlYWN0b3IocmVhY3RvcjpSZWFjdG9yKSB7XG4gICAgaWYgKCFSZWFjdG9yLmlzUmVhY3RvcihyZWFjdG9yKSkge1xuICAgICAgY29uc29sZS5sb2coXCJbUmVjaXBlXSBPYmplY3QgYWRkZWQgaXMgbm90IGEgcmVhY3RvclwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5yZWFjdG9ycy5wdXNoKHJlYWN0b3IpO1xuICB9XG4gIFxuICBsaXN0RHluYW1pY0luZ3JlZGllbnRzKCkgOiBTdXBwbHkuSW5nW10ge1xuXHQgIHJldHVybiBbXG4gICAgICBuZXcgU3VwcGx5LkluZyhFbnRpdGllcy50YXBXYXRlciwgbnVsbCwgW0RpbS5Wb2x1bWVdKSBcbiAgICBdLmNvbmNhdCh0aGlzLnJlYWN0b3JzLnJlZHVjZSh0aGlzLl9nZXRPdXRwdXQuYmluZCh0aGlzKSwgW10pKTtcbiAgfVxuICBcbiAgcHJpdmF0ZSBfZ2V0T3V0cHV0KGxhc3Q6IE9iamVjdFtdLCBlbGVtOiBSZWFjdG9yKSB7XG4gICAgcmV0dXJuIGxhc3QuY29uY2F0KGVsZW0uc3RlcHMuZmlsdGVyKHMgPT4gcy50eXBlID09PSBTdGVwVHlwZS5kZWZpbmVPdXRwdXQpKTtcbiAgfVxuICBcbiAgcHVibGljIGVuY29kZSgpIDogT2JqZWN0IHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcyk7XG4gIH1cbiAgXG4gIHB1YmxpYyBzdGF0aWMgZGVjb2RlKG8gOiB7W2tleTogc3RyaW5nXTogYW55fSkge1xuICAgIHZhciBuYW1lID0gb1snbmFtZSddO1xuICAgIHZhciByZWFjdG9ycyA9IG9bJ3JlYWN0b3JzJ10ubWFwKFJlY2lwZS5fZGVjb2RlUmVhY3Rvcik7XG4gICAgcmV0dXJuIG5ldyBSZWNpcGUobmFtZSwgcmVhY3RvcnMpO1xuICB9XG4gIFxuICBwcml2YXRlIHN0YXRpYyBfZGVjb2RlUmVhY3RvcihvIDoge1trZXk6IHN0cmluZ106IGFueX0pIDogUmVhY3RvciB7XG4gICAgcmV0dXJuIG5ldyBSZWFjdG9yKFxuICAgICAgPG51bWJlcj4ob1snaWQnXSksXG4gICAgICA8c3RyaW5nPihvWyduYW1lJ10pLFxuICAgICAgPEFycmF5PFN0ZXA+PihvWydzdGVwcyddLm1hcChSZWNpcGUuX2RlY29kZVN0ZXApKVxuICAgICk7XG4gIH1cbiAgcHJpdmF0ZSBzdGF0aWMgX2RlY29kZVN0ZXAobyA6IHtba2V5OiBzdHJpbmddOiBhbnl9KSA6IFN0ZXAge1xuICAgIHJldHVybiBuZXcgU3RlcChcbiAgICAgIDxzdHJpbmc+KG9bJ25hbWUnXSksXG4gICAgICA8Q29uY2VwdFJlZj4ob1sndHlwZSddKSxcbiAgICAgIDxzdHJpbmc+KG9bJ2lkJ10pXG4gICAgKTtcbiAgfVxuICBwcml2YXRlIHN0YXRpYyBfZGVjb2RlUmVmKG8gOiB7W2tleTogc3RyaW5nXTogYW55fSkgOiBDb25jZXB0UmVmIHtcbiAgICByZXR1cm4gbmV3IE9udG9SZWYoXG4gICAgICA8c3RyaW5nPihvWydyZWYnXSksXG4gICAgICA8c3RyaW5nPihvWyduYW1lJ10pXG4gICAgKTtcbiAgfVxufSIsImNsYXNzIEtleWJvYXJkIHtcblx0cHJpdmF0ZSBldmVudDogS2V5Ym9hcmRFdmVudDtcblx0YmluZGluZzogc3RyaW5nO1xuXHRcblx0Y29uc3RydWN0b3IoZXZlbnQ6S2V5Ym9hcmRFdmVudCkge1xuXHRcdHRoaXMuZXZlbnQgPSBldmVudDtcblx0XHR0aGlzLmJpbmRpbmcgPSBLZXlib2FyZC5nZXRLZXlCaW5kaW5nKGV2ZW50KTtcblx0fVxuXHRcblx0dG9TdHJpbmcoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy5iaW5kaW5nO1xuXHR9XG5cdFxuXHRzdGF0aWMgZnJvbUV2dChldmVudDpLZXlib2FyZEV2ZW50KTogS2V5Ym9hcmQge1xuXHRcdHJldHVybiBuZXcgS2V5Ym9hcmQoZXZlbnQpO1xuXHR9XG5cdHN0YXRpYyBnZXRLZXlCaW5kaW5nKGV2ZW50OktleWJvYXJkRXZlbnQpIDogc3RyaW5nIHtcblx0XHR2YXIgYmluZGluZzpBcnJheTxzdHJpbmc+ID0gW107XG5cdFx0XG5cdFx0aWYgKGV2ZW50LmFsdEtleSkgYmluZGluZy5wdXNoKCdhbHQnKTtcbiAgICBcdGlmIChldmVudC5jdHJsS2V5KSBiaW5kaW5nLnB1c2goJ2N0cmwnKTtcblx0XHRpZiAoZXZlbnQubWV0YUtleSkgYmluZGluZy5wdXNoKCdtZXRhJyk7XG4gICAgXHRpZiAoZXZlbnQuc2hpZnRLZXkpIGJpbmRpbmcucHVzaCgnc2hpZnQnKTtcblx0XHRiaW5kaW5nLnB1c2godGhpcy5nZXRDb2RlTmFtZShldmVudC53aGljaCkpO1xuXHRcdHJldHVybiBiaW5kaW5nLmpvaW4oJysnKTtcblx0fVxuXHRzdGF0aWMgZ2V0Q29kZU5hbWUoY29kZTpudW1iZXIpIDogc3RyaW5nIHtcblx0XHRpZiAoY29kZSA+PSAzMyAmJiBjb2RlIDw9IDEyNikgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSk7XG5cdFx0c3dpdGNoIChjb2RlKSB7XG5cdFx0XHRjYXNlICA4OiByZXR1cm4gJ2JhY2tzcGFjZSc7XG5cdFx0XHRjYXNlIDEzOiByZXR1cm4gJ2VudGVyJztcblx0XHRcdGNhc2UgMTY6IHJldHVybiAnc2hpZnQnOyAvKiogU2hpZnQgb25seSAqL1xuXHRcdFx0Y2FzZSAxODogcmV0dXJuICdzaGlmdCc7IC8qKiBBbHQgICBvbmx5ICovXG5cdFx0XHRjYXNlIDI3OiByZXR1cm4gJ2VzYyc7XG5cdFx0XHRjYXNlIDMyOiByZXR1cm4gJ3NwYWNlJztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGNvbnNvbGUud2FybignW0tleWJvYXJkXWdldENvZGVOYW1lOiBVbmtub3duIENvZGUgTmFtZSA6JywgY29kZSk7XG5cdFx0XHRcdHJldHVybiAndW5rbndvbic7XG5cdFx0fVxuXHR9XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2Uva2V5Ym9hcmQudHNcIiAvPlxuXG4vKipcbiAqIERlZmluZXMgYSBzaG9ydGN1dCB3aXRoIGEgcG9zc2libGUgYmluZGluZy5cbiAqXG4gKiBVc2VkIHRvIGJpbmQgYSBjZXJ0YWluIGtleSBjb21iaW5hdGlvbiB3aXRoIGEgU3ViUHViIG1lc3NhZ2UuXG4gKi9cbmNsYXNzIFNob3J0Y3V0IHtcbiAgLyoqIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUga2V5IGNvbWJpbmF0aW9uLiAqL1xuICBwdWJsaWMgYmluZGluZzpzdHJpbmc7XG4gIC8qKiBCYXNpYyBkZXNjcmlwdGlvbiBvZiB0aGUgYWN0aW9uIGV4cGVjdGVkLiBsZXNzIHRoYW4gODAgY2hhci4gKi9cbiAgcHVibGljIGRlc2NyaXB0aW9uOnN0cmluZztcbiAgLyoqIFRoZSBtZXNzYWdlIHRoYXQgd2lsbCBiZSBzZW50IG9uIGV2ZW50LiAqL1xuICBwdWJsaWMgaW50ZW50Ok1lc3NhZ2VUeXBlO1xufVxuXG4vKipcbiAqIE1hbmFnZXIgb2Ygc2hvcnRjdXRzLCBubyBtZXRob2QgaXMgc3RhdGljLiBVc2UgZGVmYXVsdCBmb3IgbWFpbiBpbnN0YW5jZS5cbiAqL1xuY2xhc3MgU2hvcnRjdXRzIHtcbiAgLyoqIExpc3Qgb2YgYWxsIGJvdW5kIFNob3J0Y3V0cy4gKi9cbiAgcHVibGljIGFsbDpBcnJheTxTaG9ydGN1dD4gPSBbXTtcbiAgLyoqIE1hcCBvZiBiaW5kaW5nIHRvIFNob3J0Y3V0LiAqL1xuICBwdWJsaWMgbWFwOnsgW21hcDogc3RyaW5nXTogU2hvcnRjdXQ7IH0gPSB7fVxuXG4gIHB1YmxpYyBoYXNLZXkoa2V5OktleWJvYXJkKTpib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tYXBba2V5LnRvU3RyaW5nKCldICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0KGtleTpLZXlib2FyZCk6U2hvcnRjdXQge1xuICAgIHJldHVybiB0aGlzLm1hcFtrZXkudG9TdHJpbmcoKV07XG4gIH1cblxuICAvKiogQ2hhaW5hYmxlIG1ldGhvZCB0byBhZGQgYSBTaG9ydGN1dCB0byB0aGlzIG1hbmFnZXIuICovXG4gIGFkZChiaW5kaW5nOnN0cmluZywgaW50ZW50Ok1lc3NhZ2VUeXBlLCBkZXNjcmlwdGlvbjpzdHJpbmcpIHtcbiAgICB2YXIgbmV3U2hvcnRjdXQ6U2hvcnRjdXQgPSB7XG4gICAgICBiaW5kaW5nOiBiaW5kaW5nLFxuICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxuICAgICAgaW50ZW50OiBpbnRlbnRcbiAgICB9O1xuICAgIHRoaXMuYWxsLnB1c2gobmV3U2hvcnRjdXQpO1xuICAgIHRoaXMubWFwW2JpbmRpbmddID0gbmV3U2hvcnRjdXQ7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cbiIsIm1vZHVsZSBiYXNlIHtcblxuICAvKiogQWxsb3dzIHRvIGVuY29kZSBhIG51bWJlciB0byBhIGRpZmZlcmVudCBiYXNlLiAqL1xuICBleHBvcnQgaW50ZXJmYWNlIEJhc2VDb252ZXJ0IHtcbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyB0aGUgaW5kZXggdG8gaXRzIGJhc2UgZXF1aXZhbGVudC5cbiAgICAgKiBAcGFyYW0gaWR4IE51bWJlciB0byBjb252ZXJ0c1xuICAgICAqL1xuICAgIHRvQ29kZShpZHg6bnVtYmVyKSA6IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyB0aGUgY29kZSBiYWNrIGludG8gaXRzIGFzc29jaWF0ZWQgaW5kZXguXG4gICAgICogQHBhcmFtIGJhc2UgQmFzZSB0byBjb252ZXJ0IGJhY2suXG4gICAgICovXG4gICAgdG9JZHgoYmFzZTpzdHJpbmcpIDogbnVtYmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIGNvZGVzIHRoYXQgYXJlIGVhc2lseSBhY2Nlc3NpYmxlIGZyb20gIGEga2V5Ym9hcmQuXG4gICAqXG4gICAqIFVzZWZ1bCB3aGVuIHByb3ZpZGluZyBrZXlib2FyZCBzaG9ydGN1dHMgdG8gdGhlIHVzZXIuXG4gICAqL1xuICBleHBvcnQgY2xhc3MgS2V5Ym9hcmRCYXNlIGltcGxlbWVudHMgQmFzZUNvbnZlcnQge1xuICAgIHByaXZhdGUgc3RhdGljIGNvZGVzOnN0cmluZyA9ICcwMTIzNDU2Nzg5YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonO1xuICAgIHByaXZhdGUgc3RhdGljIGVycm9yQ29kZTpzdHJpbmcgPSAnLSc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgZXJyb3JJZHg6bnVtYmVyID0gLTE7XG5cbiAgICBwdWJsaWMgdG9Db2RlKGlkeDpudW1iZXIpOnN0cmluZyB7XG4gICAgICByZXR1cm4gS2V5Ym9hcmRCYXNlLmlzSWR4VmFsaWQoaWR4KSA/IEtleWJvYXJkQmFzZS5jb2Rlc1tpZHhdIDogS2V5Ym9hcmRCYXNlLmVycm9yQ29kZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9JZHgoYmFzZTpzdHJpbmcpOm51bWJlciB7XG4gICAgICByZXR1cm4gS2V5Ym9hcmRCYXNlLmlzQ29kZVZhbGlkKGJhc2UpID8gS2V5Ym9hcmRCYXNlLmNvZGVzLmluZGV4T2YoYmFzZSkgOiBLZXlib2FyZEJhc2UuZXJyb3JJZHg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgaXNJZHhWYWxpZChpZHg6bnVtYmVyKTpib29sZWFuIHtcbiAgICAgIHJldHVybiAhaXNOYU4oaWR4KSAmJiAhKGlkeCA8IDApIHx8ICEoaWR4ID49IEtleWJvYXJkQmFzZS5jb2Rlcy5sZW5ndGgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGlzQ29kZVZhbGlkKGJhc2U6c3RyaW5nKTpib29sZWFuIHtcbiAgICAgIHJldHVybiB0eXBlb2YgKGJhc2UpID09PSAnc3RyaW5nJyAmJiBLZXlib2FyZEJhc2UuY29kZXMuaW5kZXhPZihiYXNlKSAhPT0gLTE7XG4gICAgfVxuICB9XG59XG4iLCJjbGFzcyBNZXNzYWdlVHlwZSB7XG5cdG5hbWU6c3RyaW5nO1xuXHRpZDpudW1iZXI7XG5cblx0Y29uc3RydWN0b3IobmFtZTpzdHJpbmcsIGlkOm51bWJlcikge1xuXHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0dGhpcy5pZCA9IGlkO1xuXHR9XG5cblx0c3RhdGljIHVua25vd246TWVzc2FnZVR5cGUgPSBuZXcgTWVzc2FnZVR5cGUoJ1Vua25vd24nLCAwKTtcblx0c3RhdGljIE5ld1N0ZXBDcmVhdGVkOk1lc3NhZ2VUeXBlID0gbmV3IE1lc3NhZ2VUeXBlKCdOZXdTdGVwQ3JlYXRlZCcsIDEpO1xuXHRzdGF0aWMgUmVjaXBlQ2hhbmdlZDpNZXNzYWdlVHlwZSA9IG5ldyBNZXNzYWdlVHlwZSgnUmVjaXBlQ2hhbmdlZCcsIDIpO1xuXHRzdGF0aWMgQXNrSW5ncmVkaWVudDpNZXNzYWdlVHlwZSA9IG5ldyBNZXNzYWdlVHlwZSgnQXNrSW5ncmVkaWVudCcsIDMpO1xuXHRzdGF0aWMgQW5zd2VySW5ncmVkaWVudDpNZXNzYWdlVHlwZSA9IG5ldyBNZXNzYWdlVHlwZSgnQW5zd2VySW5ncmVkaWVudCcsIDQpO1xuXHRzdGF0aWMgU2hvd1Nob3J0Y3V0czpNZXNzYWdlVHlwZSA9IG5ldyBNZXNzYWdlVHlwZSgnU2hvd1Nob3J0Y3V0cycsIDUpO1xuXHRzdGF0aWMgQ3JlYXRlU3RlcDpNZXNzYWdlVHlwZSA9IG5ldyBNZXNzYWdlVHlwZSgnQ3JlYXRlU3RlcCcsIDYpO1xuXHRzdGF0aWMgQ2FuY2VsOk1lc3NhZ2VUeXBlID0gbmV3IE1lc3NhZ2VUeXBlKCdDYW5jZWwnLCA3KTtcblx0c3RhdGljIEFza01lbnU6TWVzc2FnZVR5cGUgPSBuZXcgTWVzc2FnZVR5cGUoJ0Fza01lbnUnLCA4KTtcblx0c3RhdGljIEFuc3dlck1lbnU6TWVzc2FnZVR5cGUgPSBuZXcgTWVzc2FnZVR5cGUoJ0Fuc3dlck1lbnUnLCA5KTtcblx0c3RhdGljIEFza1RleHQ6TWVzc2FnZVR5cGUgPSBuZXcgTWVzc2FnZVR5cGUoJ0Fza1RleHQnLCAxMCk7XG5cdHN0YXRpYyBBbnN3ZXJUZXh0Ok1lc3NhZ2VUeXBlID0gbmV3IE1lc3NhZ2VUeXBlKCdBbnN3ZXJUZXh0JywgMTEpO1xuXHRzdGF0aWMgQXNrUXVhbnRpdHk6TWVzc2FnZVR5cGUgPSBuZXcgTWVzc2FnZVR5cGUoJ0Fza1F1YW50aXR5JywgMTIpO1xuXHRzdGF0aWMgQW5zd2VyUXVhbnRpdHk6TWVzc2FnZVR5cGUgPSBuZXcgTWVzc2FnZVR5cGUoJ0Fuc3dlclF1YW50aXR5JywgMTMpO1xuXHRzdGF0aWMgU2VydmVyQ29ubmVjdGVkOk1lc3NhZ2VUeXBlID0gbmV3IE1lc3NhZ2VUeXBlKCdTZXJ2ZXJDb25uZWN0ZWQnLCAxNCk7XG5cdHN0YXRpYyBVbnN1Y2Nlc3NmdWxDb25uZWN0aW9uOk1lc3NhZ2VUeXBlID0gbmV3IE1lc3NhZ2VUeXBlKCdVbnN1Y2Nlc3NmdWxDb25uZWN0aW9uJywgMTUpO1xuXHRzdGF0aWMgSW52ZW50b3J5Q2hhbmdlZDpNZXNzYWdlVHlwZSA9IG5ldyBNZXNzYWdlVHlwZSgnSW52ZW50b3J5Q2hhbmdlZCcsIDE2KTtcblx0c3RhdGljIFN0YXR1c1VwZGF0ZTpNZXNzYWdlVHlwZSA9IG5ldyBNZXNzYWdlVHlwZSgnU3RhdHVzVXBkYXRlJywgMTcpO1xuICBzdGF0aWMgUmVjaXBlU2VsZWN0ZWQ6IE1lc3NhZ2VUeXBlID0gbmV3IE1lc3NhZ2VUeXBlKCdSZWNpcGVTZWxlY3RlZCcsIDE4KTtcbn07IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIm1lc3NhZ2VUeXBlLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9kZWZzL2VzNi1wcm9taXNlL2VzNi1wcm9taXNlLmQudHNcIiAvPlxuXG5pbnRlcmZhY2UgSGFuZGxlckZ1bmMge1xuXHQoZGF0YTogYW55KTogdm9pZDtcbn1cblxuY2xhc3MgU3VzY3JpYmVyIHtcblx0b2JqOiBPYmplY3Q7XG5cdGZuOiBIYW5kbGVyRnVuYztcblx0dHlwZTogTWVzc2FnZVR5cGU7XG59XG5cbmNsYXNzIEV2ZW50QnVzIHtcblx0cHJpdmF0ZSBieVR5cGU6IHsgW3R5cGU6bnVtYmVyXTogQXJyYXk8U3VzY3JpYmVyPiB9ID0ge307XG5cdFxuXHQvKipcblx0ICogV2hlbiB0cnVlIHRoZSBidXMgd2lsbCBsb2cgYWxsIGV2ZW50cyBvbiB0aGUgY29uc29sZS5cblx0ICovXG5cdGlzTG9nZ2luZzogYm9vbGVhbiA9IHRydWU7XG5cdFxuXHQvKipcblx0ICogU2VuZHMgYW4gZXZlbnQgdG8gYWxsIHBvdGVudGlhbCBzdXNjcmliZXJzXG5cdCAqIEBwYXJhbSB0eXBlIFR5cGUgb2YgdGhlIGV2ZW50IGZyb20gRXZlbnRUeXBlXG5cdCAqIEBwYXJhbSBkYXRhIEFueSByZWxldmFudCBkYXRhLlxuXHQgKi9cblx0cHVibGlzaCh0eXBlOiBNZXNzYWdlVHlwZSwgZGF0YT86IGFueSkge1xuXHRcdCh0aGlzLmJ5VHlwZVt0eXBlLmlkXSB8fCBbXSlcblx0XHRcdC5mb3JFYWNoKChoYW5kbGVyKSA9PiB7IHRoaXMudHJpZ2dlcihoYW5kbGVyLCBkYXRhKTsgfSk7XG5cdFx0dGhpcy5sb2codHlwZSwgZGF0YSk7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBTdXNjcmliZSB0byBhIHR5cGUgb2YgZXZlbnRzLlxuXHQgKiBAcGFyYW0gaGFuZGxlciBPYmplY3QgdGhhdCB3aWxsIGhhbmRsZSB0aGUgbWVzc2FnZS5cblx0ICogQHBhcmFtIHR5cGVzIFR5cGVzIG9mIG1lc3NhZ2UgdG8gcmVnaXN0ZXIgdG8uXG5cdCAqL1xuXHRzdXNjcmliZSh0eXBlOiBNZXNzYWdlVHlwZSwgY2FsbGJhY2s6IEhhbmRsZXJGdW5jLCBvcHRUaGlzOiBPYmplY3QpIHtcblx0XHR0aGlzLmJ5VHlwZVt0eXBlLmlkXSA9IHRoaXMuYnlUeXBlW3R5cGUuaWRdIHx8IFtdO1xuXHRcdHRoaXMuYnlUeXBlW3R5cGUuaWRdLnB1c2goe1xuXHRcdFx0b2JqOiBvcHRUaGlzIHx8IFdpbmRvdyxcblx0XHRcdGZuOiBjYWxsYmFjayxcblx0XHRcdHR5cGU6IHR5cGVcblx0XHR9KTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIFB1Ymxpc2ggYSBtZXNzYWdlIGFuZCB3YWl0cyBmb3IgYW4gYW5zd2VyLiBcblx0ICovXG5cdHB1Ymxpc2hBbmRXYWl0Rm9yKHdhaXRGb3JUeXBlOiBNZXNzYWdlVHlwZSwgcHVibGlzaFR5cGU6IE1lc3NhZ2VUeXBlLCBkYXRhPzogYW55KSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHRoaXMuc3VzY3JpYmUod2FpdEZvclR5cGUsIChkYXRhKSA9PiB7IHJlc29sdmUoZGF0YSk7IH0sIHRoaXMpO1xuXHRcdFx0dGhpcy5wdWJsaXNoKHB1Ymxpc2hUeXBlLCBkYXRhKTtcblx0XHR9KTtcblx0fVxuXHRcblx0cHJpdmF0ZSBsb2codHlwZTogTWVzc2FnZVR5cGUsIGRhdGE6IGFueSkge1xuXHRcdGlmICh0aGlzLmlzTG9nZ2luZykgY29uc29sZS5sb2coJ1tFdmVudEJ1c10nLCB0eXBlLCBkYXRhKTtcblx0fVxuXHRwcml2YXRlIHRyaWdnZXIoaGFuZGxlcjogU3VzY3JpYmVyLCBkYXRhOiBhbnkpIHtcblx0XHRoYW5kbGVyLmZuLmNhbGwoaGFuZGxlci5vYmosIGRhdGEpO1xuXHR9XG59XG5cbnZhciBidXMgPSBuZXcgRXZlbnRCdXMoKTsiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vYmFzZS9jb25jZXB0UmVmLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJkaW1lbnNpb24udHNcIiAvPlxuXG5jbGFzcyBVbml0IHtcblx0Y29uY2VwdDogQ29uY2VwdFJlZjtcblx0c3ltYm9sOnN0cmluZztcblx0b2Zmc2V0Om51bWJlcjtcblx0bXVsdGlwbGllcjpudW1iZXI7XG5cdGRpbWVuc2lvbjogRGltO1xuXHRzeXN0ZW06IFVuaXRTeXN0ZW07XG5cblx0Y29uc3RydWN0b3IoY29uY2VwdDpDb25jZXB0UmVmLCBzeW1ib2w6c3RyaW5nLCBvZmZzZXQ6bnVtYmVyLCBtdWx0aXBsaWVyOm51bWJlciwgZGltOkRpbSwgc3lzdGVtOlVuaXRTeXN0ZW0pIHtcblx0XHR0aGlzLmNvbmNlcHQgPSBjb25jZXB0O1xuXHRcdHRoaXMuc3ltYm9sID0gc3ltYm9sO1xuXHRcdHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xuXHRcdHRoaXMubXVsdGlwbGllciA9IG11bHRpcGxpZXI7XG5cdFx0dGhpcy5kaW1lbnNpb24gPSBkaW07XG5cdFx0dGhpcy5zeXN0ZW0gPSBzeXN0ZW07XG5cdH1cblx0XG5cdHRvU3RyaW5nKCkgOiBzdHJpbmcge1xuXHRcdHJldHVybiB0aGlzLmNvbmNlcHQgKyAnKCcgKyB0aGlzLnN5bWJvbCArICcpJztcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgVW5rbm93biA9IG5ldyBVbml0KE9udG9SZWYuY3JlYXRlQW5vbigndW5rbm93blVuaXQnKSwgJycsIDAsIDAsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdW5pdHMvdW5pdC50c1wiIC8+XG5cbmNsYXNzIFF1YW50aXR5IHtcblx0bWFnbml0dWRlOiBudW1iZXI7XG5cdHVuaXQ6IFVuaXQ7XG5cdFxuXHRjb25zdHJ1Y3RvcihtYWduaXR1ZGU6IG51bWJlciwgdW5pdDogVW5pdCkge1xuXHRcdHRoaXMubWFnbml0dWRlID0gbWFnbml0dWRlO1xuXHRcdHRoaXMudW5pdCA9IHVuaXQ7XHRcblx0fVxuXHRcblx0dG9TdHJpbmcoKSA6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHRoaXMubWFnbml0dWRlICsgJyAnICsgdGhpcy51bml0LnN5bWJvbDtcblx0fVxufSIsImNsYXNzIExpc3ROb2RlIHtcblx0cGF5bG9hZDogYW55O1xuXHRuZXh0OiBMaXN0Tm9kZTtcblx0bGFzdDogTGlzdE5vZGU7XG5cdFxuXHRjb25zdHJ1Y3RvcihwYXlsb2FkOmFueSkge1xuXHRcdHRoaXMucGF5bG9hZCA9IHBheWxvYWQ7XG5cdFx0dGhpcy5uZXh0ID0gbnVsbDtcblx0XHR0aGlzLmxhc3QgPSBudWxsO1xuXHR9XHRcdFxufVxuXG5jbGFzcyBMaXN0IHtcblx0YmVnaW46IExpc3ROb2RlO1xuXHRlbmQ6IExpc3ROb2RlO1xuXHRwdXNoKHBheWxvYWQ6YW55KSB7XG5cdFx0dmFyIG5ld05vZGUgPSBuZXcgTGlzdE5vZGUocGF5bG9hZCk7XG5cdCAgICBpZiAodGhpcy5lbmQgPT09IG51bGwpIHtcblx0ICAgICAgdGhpcy5iZWdpbiA9IG5ld05vZGU7XG5cdCAgICAgIHRoaXMuZW5kID0gbmV3Tm9kZTtcblx0ICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICB9XG5cdCAgICB0aGlzLmVuZC5uZXh0ID0gbmV3Tm9kZTtcblx0ICAgIG5ld05vZGUubGFzdCA9IHRoaXMuZW5kO1xuXHQgICAgdGhpcy5lbmQgPSBuZXdOb2RlO1xuXHR9XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2Jhc2UvZXZlbnRCdXMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2Jhc2UvbWVzc2FnZVR5cGUudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2RlZnMvZXM2LXByb21pc2UvZXM2LXByb21pc2UuZC50c1wiIC8+XG5cbi8qKlxuICogU2VydmVyIHByb3h5IG9iamVjdCB3aGljaCBzZXJ2ZXMgYXMgYW4gT2JqZWN0IHRoYXQgY291bGQgYmUgcXVlcmllZCBmcm9tIEpTLlxuICovXG5pbnRlcmZhY2UgU2VydmVyIHtcbiAgLyoqIFdoZXRoZXIgYSBzZXJ2ZXIgaXMgY29ubmVjdGVkLiBDYW4gYmUgbnVsbC4gKi9cbiAgaXNDb25uZWN0ZWQ6IEJvb2xlYW47XG5cbiAgZW5kcG9pbnQoKTogc3RyaW5nO1xuICBzeW5jSW52ZW50b3J5KCk6IFByb21pc2U8T2JqZWN0Pjtcbn1cblxuY2xhc3MgU2VydmVySW1wbCB7XG4gIC8qKiBXaGV0aGVyIGEgc2VydmVyIGlzIGNvbm5lY3RlZC4gQ2FuIGJlIG51bGwuICovXG4gIHB1YmxpYyBpc0Nvbm5lY3RlZDogQm9vbGVhbiA9IG51bGw7XG5cbiAgcHJpdmF0ZSB3czogV2ViU29ja2V0O1xuICBwcml2YXRlIHVybDogc3RyaW5nO1xuICBwcml2YXRlIGNsaWVudElkOiBzdHJpbmc7XG4gIHByaXZhdGUgcGFja2V0SWRDb3VudGVyOiBudW1iZXI7XG4gIHByaXZhdGUgdGltZW91dE1zOiBudW1iZXI7XG4gIHByaXZhdGUgY29tbXVuaWNhdGlvbnM6IHsgW2lkOiBudW1iZXJdOiAodmFsdWU/OiBPYmplY3QgfCBUaGVuYWJsZTxPYmplY3Q+KSA9PiB2b2lkOyB9O1xuXG4gIHB1YmxpYyBlbmRwb2ludCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnVybDtcbiAgfVxuXG4gIHB1YmxpYyBzeW5jSW52ZW50b3J5KCk6IFByb21pc2U8T2JqZWN0PiB7XG4gICAgdmFyIHBhY2tldCA9IHtcbiAgICAgIHR5cGU6ICdzeW5jSW52ZW50b3J5JyxcbiAgICAgIGRhdGE6IDxPYmplY3Q+bnVsbCxcbiAgICAgIGlkOiB0aGlzLnBhY2tldElkQ291bnRlcixcbiAgICAgIGNsaWVudElkOiB0aGlzLmNsaWVudElkXG4gICAgfTtcblxuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIHRoaXMuY29tbXVuaWNhdGlvbnNbdGhpcy5wYWNrZXRJZENvdW50ZXJdID0gcmVzb2x2ZTtcbiAgICB9KTtcblxuICAgIHRoaXMucGFja2V0SWRDb3VudGVyKys7XG4gICAgY29uc29sZS5pbmZvKCdzZXJ2ZXIuc2VuZCcsIHBhY2tldCk7XG4gICAgdGhpcy53cy5zZW5kKEpTT04uc3RyaW5naWZ5KHBhY2tldCkpO1xuXG4gICAgcmV0dXJuIFByb21pc2UucmFjZShbXG4gICAgICBuZXcgUHJvbWlzZSgoXywgcmVqZWN0KSA9PiB7IHNldFRpbWVvdXQocmVqZWN0LCB0aGlzLnRpbWVvdXRNcyk7IH0pLFxuICAgICAgcHJvbWlzZVxuICAgIF0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGVuZHBvaW50OiBzdHJpbmcpIHtcbiAgICBpZiAoZW5kcG9pbnQgPT09IHVuZGVmaW5lZClcbiAgICAgIHJldHVybjtcbiAgICB0aGlzLnVybCA9IGVuZHBvaW50O1xuICAgIHRoaXMucGFja2V0SWRDb3VudGVyID0gMDtcbiAgICB0aGlzLnRpbWVvdXRNcyA9IDUwMDtcbiAgICB0aGlzLmNsaWVudElkID0gXCJ1aWQwMDAwMVwiO1xuICAgIHRyeSB7XG4gICAgICAgIHRoaXMud3MgPSBuZXcgV2ViU29ja2V0KHRoaXMudXJsKTsgIFxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJywgZSk7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuY29tbXVuaWNhdGlvbnMgPSB7fTtcblxuICAgIHRoaXMud3Mub25jbG9zZSA9IHRoaXMuX29uQ2xvc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLndzLm9uZXJyb3IgPSB0aGlzLl9vbkVycm9yLmJpbmQodGhpcyk7XG4gICAgdGhpcy53cy5vbm1lc3NhZ2UgPSB0aGlzLl9vbk1lc3NhZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLndzLm9ub3BlbiA9IHRoaXMuX29uT3Blbi5iaW5kKHRoaXMpO1xuICB9XG5cbiAgcHJpdmF0ZSBfb25DbG9zZSgpIHtcbiAgICBpZiAodGhpcy5pc0Nvbm5lY3RlZCA9PT0gbnVsbClcbiAgICAgIGJ1cy5wdWJsaXNoKE1lc3NhZ2VUeXBlLlVuc3VjY2Vzc2Z1bENvbm5lY3Rpb24pO1xuICB9XG5cbiAgcHJpdmF0ZSBfb25FcnJvcigpIHtcblxuICB9XG5cbiAgcHJpdmF0ZSBfb25NZXNzYWdlKG1zZzogTWVzc2FnZUV2ZW50KSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBwa2cgPSBKU09OLnBhcnNlKG1zZy5kYXRhKTtcbiAgICAgIGNvbnNvbGUuaW5mbygnc2VydmVyLnJlY2VpdmVkJywgcGtnKTtcbiAgICAgIHZhciBjYWxsYmFjayA9IHRoaXMuY29tbXVuaWNhdGlvbnNbcGtnLmlkXTtcbiAgICAgIGlmIChjYWxsYmFjayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNhbGxiYWNrKHBrZy5kYXRhKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUud2FybignRXJyb3IgcGFyc2luZyAnICsgZXJyLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX29uT3BlbigpIHtcbiAgICBidXMucHVibGlzaChNZXNzYWdlVHlwZS5TZXJ2ZXJDb25uZWN0ZWQpO1xuICB9XG59IiwiZW51bSBJdGVtVHlwZSB7XG4gIEZlcm1lbnRhYmxlcyxcbiAgSG9wcyxcbiAgWWVhc3RzLFxuICBNaXNjZWxsYW5lb3VzLFxuICBEeW5hbWljc1xufTsiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiaXRlbS50c1wiIC8+XG5cbmNsYXNzIFN0b2NrIHtcbiAgaXRlbTogSXRlbTtcbiAgcXVhbnRpdHk6IFF1YW50aXR5O1xuICBib3VnaHRPbjogRGF0ZTtcbiAgcHJvdmlkZXI6IFN0cmluZztcblxuICBwdWJsaWMgc3RhdGljIGZyb21SYXcoaXRlbTogSXRlbSwgcmF3OiBhbnkpOiBTdG9jayB7XG4gICAgdmFyIHMgPSBuZXcgU3RvY2soKTtcbiAgICBzLml0ZW0gPSBpdGVtO1xuICAgIHMucXVhbnRpdHkgPSByYXcucXVhbnRpdHk7XG4gICAgcy5ib3VnaHRPbiA9IG5ldyBEYXRlKHJhdy5ib3VnaHRPbik7XG4gICAgcy5wcm92aWRlciA9IHJhdy5wcm92aWRlcjtcbiAgICByZXR1cm4gcztcbiAgfVxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9iYXNlL2NvbmNlcHRSZWYudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3VuaXRzL2RpbWVuc2lvbi50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiaXRlbVR5cGUudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInN0b2NrLnRzXCIgLz5cblxuY2xhc3MgSXRlbSB7XG4gIHR5cGU6IEl0ZW1UeXBlO1xuICBuYW1lOiBzdHJpbmc7XG4gIHJlZjogc3RyaW5nO1xuICBzdG9ja3M6IFN0b2NrW107XG5cbiAgcHVibGljIHN0YXRpYyBmcm9tUmF3KHJhdzogYW55KTogSXRlbSB7XG4gICAgdmFyIGkgOiBJdGVtID0gbmV3IEl0ZW0oKTtcblxuICAgIHN3aXRjaChyYXcudHlwZSkge1xuICAgICAgY2FzZSAnRmVybWVudGFibGVzJzpcbiAgICAgICAgaS50eXBlID0gSXRlbVR5cGUuRmVybWVudGFibGVzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0hvcHMnOlxuICAgICAgICBpLnR5cGUgPSBJdGVtVHlwZS5Ib3BzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1llYXN0cyc6XG4gICAgICAgIGkudHlwZSA9IEl0ZW1UeXBlLlllYXN0cztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdNaXNjZWxsYW5lb3VzJzpcbiAgICAgICAgaS50eXBlID0gSXRlbVR5cGUuTWlzY2VsbGFuZW91cztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdEeW5hbWljcyc6XG4gICAgICAgIGkudHlwZSA9IEl0ZW1UeXBlLkR5bmFtaWNzO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaS5uYW1lID0gcmF3Lm5hbWU7XG4gICAgaS5yZWYgPSByYXcucmVmO1xuICAgIGkuc3RvY2tzID0gcmF3LnN0b2Nrcy5tYXAoKHM6IGFueSkgPT4geyByZXR1cm4gU3RvY2suZnJvbVJhdyhpLCBzKTsgfSk7XG4gICAgcmV0dXJuIGk7XG4gIH1cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiaXRlbS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiaXRlbVR5cGUudHNcIiAvPlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vYmFzZS9ldmVudEJ1cy50c1wiIC8+XG4vKipcbiAqIFRoZSBpbnZlbnRvcnkgaXMgYSBjb2xsZWN0aW9uIG9mIGl0ZW1zIGhhdmluZyB0eXBlcyBhbmQgd2hpY2ggY2FuIGJlIHBhcnQgb2Ygc3RvY2tzLlxuICpcbiAqIEZlcm1lbnRhYmxlcywgZm9yIGV4YW1wbGVzLCBpcyBhIHR5cGUgb2YgaXRlbXMuIEEgY2VydGFpbiBxdWFudGl0eSBvZiBhbiBpdGVtLCBwdXJjaGFzZWRcbiAqIGF0IGEgY2VydGFpbiB0aW1lLCBmcm9tIGEgY2VydGFpbiBzdXBwbGllciBpcyBhIHN0b2NrLlxuICovXG5jbGFzcyBJbnZlbnRvcnkge1xuICBwcml2YXRlIGl0ZW1zOiBJdGVtW107XG4gIHByaXZhdGUgc3RvY2tzOiBTdG9ja1tdO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICB0aGlzLnN0b2NrcyA9IFtdO1xuICB9XG5cbiAgcHVibGljIGxpc3RJdGVtKHR5cGU/OiBJdGVtVHlwZSkge1xuICAgIGlmICh0eXBlID09PSB1bmRlZmluZWQpXG4gICAgICByZXR1cm4gdGhpcy5pdGVtcztcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5maWx0ZXIoKGkpID0+IHsgcmV0dXJuIGkudHlwZSA9PT0gdHlwZTsgfSk7XG4gIH1cblxuICBwdWJsaWMgYWRkSXRlbShpdGVtOiBJdGVtKSB7XG4gICAgdGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xuICAgIGl0ZW0uc3RvY2tzLmZvckVhY2goKHMpID0+IHsgdGhpcy5zdG9ja3MucHVzaChzKTsgfSlcbiAgICBidXMucHVibGlzaChNZXNzYWdlVHlwZS5JbnZlbnRvcnlDaGFuZ2VkKTtcbiAgfVxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJkaW1lbnNpb24udHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInVuaXQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2Jhc2UvY29uY2VwdFJlZi50c1wiIC8+XG5cbmNsYXNzIFN5c3RlbUltcGwge1xuICBwcml2YXRlIHVuaXRzOiBBcnJheTxVbml0PiA9IFtdO1xuICBuYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IobmFtZTpzdHJpbmcsIHVuaXRzOiBBcnJheTxVbml0Pikge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy51bml0cyA9IHVuaXRzO1xuICAgIHRoaXMudW5pdHMuZm9yRWFjaCgodTogVW5pdCkgPT4geyB1LnN5c3RlbSA9IHRoaXM7IH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3ltKHN5bWJvbDpzdHJpbmcpIDogVW5pdCB7XG4gICAgcmV0dXJuIHRoaXMudW5pdHMuZmlsdGVyKHUgPT4gdS5zeW1ib2wgPT09IHN5bWJvbClbMF07XG4gIH1cblxuICBkaW0oZGltOiBEaW0pIDogQXJyYXk8VW5pdD4ge1xuICAgIHJldHVybiB0aGlzLnVuaXRzLmZpbHRlcih1ID0+IHUuZGltZW5zaW9uID09PSBkaW0pO1xuICB9XG4gIFxuICBnZXRCeUlkKGlkOiBzdHJpbmcpIDogVW5pdCB7XG4gICAgdmFyIG1hdGNoOiBVbml0W10gPSB0aGlzLnVuaXRzLmZpbHRlcigodTogVW5pdCkgPT4geyByZXR1cm4gdS5jb25jZXB0LnJlZiA9PT0gaWQ7IH0pO1xuICAgIHJldHVybiBtYXRjaC5sZW5ndGggPT09IDAgPyBudWxsIDogbWF0Y2hbMF07XG4gIH1cbn1cblxuY2xhc3MgVW5pdFN5c3RlbSB7XG4gIHB1YmxpYyBzdGF0aWMgU0kgPSBuZXcgU3lzdGVtSW1wbCgnU0knLCBbXG4gICAgbmV3IFVuaXQobmV3IE9udG9SZWYoJ2JyZXc6a2cnLCAna2lsb2dyYW0nKSwgJ2tnJywgMCwgMSwgRGltLk1hc3MsIG51bGwpLFxuICAgIG5ldyBVbml0KG5ldyBPbnRvUmVmKCdicmV3OmxpdGVyJywgJ2xpdGVyJyksICdsJywgMCwgMSwgRGltLlZvbHVtZSwgbnVsbCksXG4gICAgbmV3IFVuaXQobmV3IE9udG9SZWYoJ2JyZXc6a2VsdmluJywgJ2tlbHZpbicpLCAnSycsIDAsIDEsIERpbS5UZW1wZXJhdHVyZSwgbnVsbCksXG4gICAgbmV3IFVuaXQobmV3IE9udG9SZWYoJ2JyZXc6Y2Vsc2l1cycsICdjZWxzaXVzJyksICdDJywgMCwgMSwgRGltLlRlbXBlcmF0dXJlLCBudWxsKSxcbiAgICBuZXcgVW5pdChuZXcgT250b1JlZignYnJldzptaW51dGUnLCAnbWludXRlJyksICdtaW4nLCAwLCAxLCBEaW0uVGVtcG9yYWwsIG51bGwpXG4gIF0pO1xuICBwdWJsaWMgc3RhdGljIFVzQ3VzdCA9IG5ldyBTeXN0ZW1JbXBsKCdVcyBDdXN0LicsIFtcbiAgICAgIG5ldyBVbml0KG5ldyBPbnRvUmVmKCdicmV3OmluY2gnLCAnaW5jaCcpLCAnaW4nLCAwLCAxLCBEaW0uTGVuZ3RoLCBudWxsKSxcbiAgICAgIG5ldyBVbml0KG5ldyBPbnRvUmVmKCdicmV3OnBpbnQnLCAncGludCcpLCAncHQnLCAwLCAxLCBEaW0uVm9sdW1lLCBudWxsKSxcbiAgICAgIG5ldyBVbml0KG5ldyBPbnRvUmVmKCdicmV3OmN1cCcsICdjdXAnKSwgJ2N1cCcsIDAsIDEsIERpbS5Wb2x1bWUsIG51bGwpLFxuICAgICAgbmV3IFVuaXQobmV3IE9udG9SZWYoJ2JyZXc6dHNwJywgJ3RlYXNwb29uJyksICd0c3AnLCAwLCAxLCBEaW0uVm9sdW1lLCBudWxsKSxcbiAgICAgIG5ldyBVbml0KG5ldyBPbnRvUmVmKCdicmV3OmZhcmVuaGVpdCcsICdmYXJlbmhlaXQnKSwgJ0YnLCAwLCAxLCBEaW0uVGVtcGVyYXR1cmUsIG51bGwpXG4gIF0pO1xuICBwdWJsaWMgc3RhdGljIEltcGVyaWFsID0gbmV3IFN5c3RlbUltcGwoJ0ltcGVyaWFsJywgW1xuICBdKTtcbiAgXG4gIHB1YmxpYyBzdGF0aWMgYWxsKCkgOiBBcnJheTxTeXN0ZW1JbXBsPiB7IHJldHVybiBbdGhpcy5TSSwgdGhpcy5Vc0N1c3QsIHRoaXMuSW1wZXJpYWxdOyB9XG4gIFxuICBwdWJsaWMgc3RhdGljIGdldFVuaXQoaWQ6IHN0cmluZykgOiBVbml0IHtcbiAgICB2YXIgbWF0Y2g6IFVuaXRbXSA9IHRoaXMuYWxsKClcbiAgICAgIC5tYXAoKHN5c3RlbTpTeXN0ZW1JbXBsLCBpZHg6IG51bWJlciwgYXJyOiBTeXN0ZW1JbXBsW10pID0+IHtcbiAgICAgICAgcmV0dXJuIHN5c3RlbS5nZXRCeUlkKGlkKVxuICAgICAgfSlcbiAgICAgIC5maWx0ZXIoKHVuaXQ6IFVuaXQpID0+IHtcbiAgICAgICAgcmV0dXJuIHVuaXQgIT09IG51bGw7XG4gICAgICB9KTtcbiAgICByZXR1cm4gbWF0Y2gubGVuZ3RoID09PSAwID8gbnVsbCA6IG1hdGNoWzBdO1xuICB9XG59XG5cbnZhclxuICBTSTogU3lzdGVtSW1wbCA9IFVuaXRTeXN0ZW0uU0ksXG4gIFVzQ3VzdDogU3lzdGVtSW1wbCA9IFVuaXRTeXN0ZW0uVXNDdXN0LFxuICBJbXBlcmlhbDogU3lzdGVtSW1wbCA9IFVuaXRTeXN0ZW0uSW1wZXJpYWw7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
