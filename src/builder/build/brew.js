var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base;
(function (base_1) {
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
    }());
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
    MessageType.StylesLoaded = new MessageType('StylesLoaded', 19);
    MessageType.EquipmentsLoaded = new MessageType('EquipmentsLoaded', 20);
    MessageType.UnitsLoaded = new MessageType('UnitsLoaded', 21);
    return MessageType;
}());
;
var Suscriber = (function () {
    function Suscriber() {
    }
    return Suscriber;
}());
var EventBus = (function () {
    function EventBus() {
        this.byType = {};
        this.isLogging = false;
    }
    EventBus.prototype.publish = function (type, data) {
        var _this = this;
        (this.byType[type.id] || [])
            .forEach(function (handler) { _this.trigger(handler, data); });
        this.log(type, data);
    };
    EventBus.prototype.thenPublish = function (type) {
        var _this = this;
        return function () { _this.publish(type); };
    };
    EventBus.prototype.suscribe = function (type, callback, optThis) {
        this.byType[type.id] = this.byType[type.id] || [];
        this.byType[type.id].push({
            obj: optThis || Window,
            fn: callback,
            type: type
        });
    };
    EventBus.prototype.onFirstMsg = function (type) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.suscribe(type, resolve);
        });
    };
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
}());
var bus = new EventBus();
var Log = (function () {
    function Log() {
    }
    Log.time = function () {
        var d = new Date();
        return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds();
    };
    Log.format = function (time, className, msg) {
        return "[" + time + "]<" + className + "> : " + msg;
    };
    Log.info = function (className, msg) {
        console.info(Log.format(Log.time(), (className || "anon"), msg));
    };
    Log.warn = function (className, msg) {
        console.warn(Log.format(Log.time(), (className || "anon"), msg));
    };
    Log.error = function (className, msg) {
        console.error(Log.format(Log.time(), (className || "anon"), msg));
    };
    return Log;
}());
var Iri = (function () {
    function Iri() {
    }
    Iri.isAnon = function (iri) {
        return Iri.split(iri)[0] === "";
    };
    Iri.getNs = function (iri) {
        return Iri.split(iri)[0];
    };
    Iri.getRemainder = function (iri) {
        return Iri.split(iri)[1];
    };
    Iri.split = function (iri) {
        if (iri == null || !(typeof iri === 'string') || iri.indexOf(':') == -1) {
            Log.warn('Iri', 'Invalid IRI : ' + iri);
            return ['', ''];
        }
        return iri.split(":");
    };
    return Iri;
}());
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
            case 16: return 'shift';
            case 18: return 'shift';
            case 27: return 'esc';
            case 32: return 'space';
            default:
                console.warn('[Keyboard]getCodeName: Unknown Code Name :', code);
                return 'unknwon';
        }
    };
    return Keyboard;
}());
var Res = (function () {
    function Res(_iri) {
        this._iri = _iri;
    }
    Object.defineProperty(Res.prototype, "iri", {
        get: function () {
            return this._iri;
        },
        enumerable: true,
        configurable: true
    });
    return Res;
}());
var ServerImpl = (function () {
    function ServerImpl(endpoint) {
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
            Log.error("Server", JSON.stringify(e));
        }
        this.communications = {};
        this.ws.onclose = this._onClose.bind(this);
        this.ws.onerror = ServerImpl._onError.bind(this);
        this.ws.onmessage = this._onMessage.bind(this);
        this.ws.onopen = this._onOpen.bind(this);
    }
    ServerImpl.prototype.endpoint = function () {
        return this.url;
    };
    ServerImpl.prototype.getStyles = function () {
        return this._req('styles');
    };
    ServerImpl.prototype.getEquipments = function () {
        return this._req('equipments');
    };
    ServerImpl.prototype.getUnits = function () {
        return this._req('units');
    };
    ServerImpl.prototype.compute = function (recipe) {
        return this._req('compute', recipe.encode());
    };
    ServerImpl.prototype.syncInventory = function () {
        return this._req('syncInventory');
    };
    ServerImpl.prototype._onMessage = function (msg) {
        if (msg.data === 'Unsupported Requested Type') {
            Log.error('Server ', msg.data + ' ' + msg.target.url);
            return;
        }
        var response = ServerImpl.unwrap(msg.data);
        if (response == null)
            return;
        if (response.id == null) {
            Log.warn("Server", "Received Malformed Packaged." + JSON.stringify(response));
            return;
        }
        var callback = this.communications[response.id];
        if (callback == null) {
            Log.warn('Server', 'No callback for received pkg ' + response.id);
            return;
        }
        callback(response.data);
    };
    ServerImpl.unwrap = function (json) {
        try {
            return JSON.parse(json);
        }
        catch (err) {
            Log.warn('Server', 'Error parsing ' + err.message);
            return null;
        }
    };
    ServerImpl.prototype._req = function (path, data) {
        var _this = this;
        var packetId = this.packetIdCounter++, timeoutId, promise = Promise.race([
            new Promise(function (_, reject) {
                timeoutId = setTimeout(reject, _this.timeoutMs);
            }),
            new Promise(function (resolve) {
                _this.communications[packetId] = resolve;
                _this.ws.send(JSON.stringify({ type: path, data: data, id: packetId, clientId: _this.clientId }));
            })
        ]);
        return promise.then(function (data) {
            clearTimeout(timeoutId);
            return data;
        }).catch(function (err) {
            Log.error('Server', 'Received server error');
            throw err;
            return null;
        });
    };
    ServerImpl.prototype._onOpen = function () {
        this.isConnected = true;
        bus.publish(MessageType.ServerConnected, this);
    };
    ServerImpl.prototype._onClose = function () {
        if (this.isConnected !== null) {
            Log.warn('Server', 'Closing for unknown reasons');
            return;
        }
        bus.publish(MessageType.UnsuccessfulConnection);
    };
    ServerImpl._onError = function (err) {
        Log.warn('Server', 'Websocket error ' + JSON.stringify(err));
    };
    return ServerImpl;
}());
var PhysQty = (function (_super) {
    __extends(PhysQty, _super);
    function PhysQty(iri) {
        _super.call(this, iri);
    }
    PhysQty.all = function () {
        return Object.keys(PhysQty.known).map(function (k) { return PhysQty.known[k]; });
    };
    PhysQty.byRef = function (ref) {
        if (PhysQty.known[ref] == null)
            PhysQty.known[ref] = new PhysQty(ref);
        return PhysQty.known[ref];
    };
    PhysQty.known = {};
    return PhysQty;
}(Res));
var UnitSys = (function (_super) {
    __extends(UnitSys, _super);
    function UnitSys(iri) {
        _super.call(this, iri);
    }
    UnitSys.all = function () {
        return Object.keys(UnitSys.known).map(function (k) { return UnitSys.known[k]; });
    };
    UnitSys.byRef = function (ref) {
        if (UnitSys.known[ref] == null)
            UnitSys.known[ref] = new UnitSys(ref);
        return UnitSys.known[ref];
    };
    UnitSys.known = {};
    return UnitSys;
}(Res));
var RawUnit = (function () {
    function RawUnit() {
    }
    return RawUnit;
}());
var Unit = (function (_super) {
    __extends(Unit, _super);
    function Unit(base, mult, offset, physQty, ref, sym, system) {
        _super.call(this, ref);
        this.baseUnit = base;
        this.multiplier = mult;
        this.offset = offset;
        this.physicalQuantity = physQty;
        this.symbol = sym;
        this.system = system;
    }
    Unit.prototype.getBaseUnit = function () { return Units.byRef(this.baseUnit); };
    Unit.prototype.getSymbol = function () { return this.symbol; };
    return Unit;
}(Res));
var Units = (function () {
    function Units() {
    }
    Units.getAll = function () {
        return Object.keys(Units.known).map(function (k) { return Units.known[k]; });
    };
    Units.byRef = function (ref) {
        return Units.known[ref];
    };
    Units.bySymbol = function (symbol) {
        var found = Units.getAll().filter(function (u) { return u.getSymbol() === symbol; });
        if (found.length == 0)
            Log.warn('Units', 'Did not find unit for symbol ' + symbol);
        return found[0];
    };
    Units.initialize = function (server) {
        Log.info('Units', 'Loading Units');
        server.getUnits()
            .then(Units.load)
            .then(bus.thenPublish(MessageType.UnitsLoaded));
    };
    Units.load = function (data) {
        data.forEach(function (raw) {
            Units.known[raw.ref] = new Unit(raw.baseUnit, raw.multiplier, raw.offset, PhysQty.byRef(raw.physicalQuantity), raw.ref, raw.symbol, UnitSys.byRef(raw.system));
        });
        Log.info("Units", Units.getAll().length + " Units loaded");
    };
    Units.known = {};
    return Units;
}());
var SU = Units.bySymbol;
bus.suscribe(MessageType.ServerConnected, function (server) { Units.initialize(server); }, null);
var Quantity = (function () {
    function Quantity(magnitude, unit) {
        if (unit == null)
            console.warn('Quantity created with null unit');
        this.magnitude = magnitude;
        this.unit = unit;
    }
    Quantity.prototype.toString = function () {
        return this.magnitude + ' ' + this.unit.getSymbol();
    };
    Quantity.prototype.encode = function () {
        return {
            magnitude: this.magnitude,
            unit: this.unit != null ? this.unit.iri : null
        };
    };
    return Quantity;
}());
var ListNode = (function () {
    function ListNode(payload) {
        this.payload = payload;
        this.next = null;
        this.last = null;
    }
    return ListNode;
}());
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
}());
var Entities = (function () {
    function Entities() {
    }
    Entities.tapWater = new OntoRef('brew:tapWater', 'Tap Water');
    Entities.inventory = new OntoRef('brew:personalInventory', 'Personal Inventory');
    Entities.kg = new OntoRef('unit:kilogram', 'kilogram');
    Entities.liter = new OntoRef('unit:liter', 'liter');
    Entities.syrup = new OntoRef('brew:brewersSyrop', 'Brewer\'s Syrup');
    Entities.dme = new OntoRef('brew:dme', 'Dry Malt Extract');
    Entities.lmeClear = new OntoRef('brew:lmeClear', 'Clear LME');
    Entities.dmeClear = new OntoRef('brew:dmeClear', 'Clear DME');
    Entities.c120 = new OntoRef('brew:crystal120', 'Crystal 120');
    Entities.c60 = new OntoRef('brew:crystal60', 'Crystal 60');
    Entities.paleChoco = new OntoRef('brew:PaleChocolate', 'Pale Chocolate');
    Entities.blackMalt = new OntoRef('brew:BlackMalt', 'Black Malt');
    Entities.flakedRye = new OntoRef('brew:FlakedRye', 'Flaked Rye');
    Entities.rolledOat = new OntoRef('brew:RolledOat', 'Rolled Oat');
    Entities.tableSugar = new OntoRef('brew:tableSugar', 'Table Sugar');
    Entities.columbusHop = new OntoRef('brew:columbusHops', 'Columbus');
    Entities.yeastNutrient = new OntoRef('brew:yeastNutrient', 'Yeast Nutrient');
    Entities.w2112 = new OntoRef('brew:w2112', 'Wyeast California Lager');
    Entities.us05 = new OntoRef('brew:us05', 'Safale US-05');
    return Entities;
}());
var CancelError = (function () {
    function CancelError() {
        this.name = 'Cancel';
        this.message = 'Operation has been cancelled.';
    }
    return CancelError;
}());
var UnimplementedError = (function () {
    function UnimplementedError() {
        this.name = 'Unimplemented';
        this.message = 'Operation not yet implemented.';
    }
    return UnimplementedError;
}());
var InvalidStateError = (function () {
    function InvalidStateError() {
        this.name = 'InvalidState';
        this.message = 'Invalid state reached.';
    }
    return InvalidStateError;
}());
var SubstanceType;
(function (SubstanceType) {
    SubstanceType[SubstanceType["Fermentable"] = 0] = "Fermentable";
    SubstanceType[SubstanceType["Hops"] = 1] = "Hops";
    SubstanceType[SubstanceType["Miscellaneous"] = 2] = "Miscellaneous";
    SubstanceType[SubstanceType["Water"] = 3] = "Water";
    SubstanceType[SubstanceType["Yeast"] = 4] = "Yeast";
})(SubstanceType || (SubstanceType = {}));
var SubstanceTypes = [
    0,
    1,
    2,
    3,
    4
];
var Substance = (function (_super) {
    __extends(Substance, _super);
    function Substance(iri) {
        _super.call(this, iri);
    }
    return Substance;
}(Res));
var Supply;
(function (Supply) {
    (function (Type) {
        Type[Type["Dynamic"] = 0] = "Dynamic";
        Type[Type["Fermentable"] = 1] = "Fermentable";
        Type[Type["Hops"] = 2] = "Hops";
        Type[Type["Miscellaneous"] = 3] = "Miscellaneous";
        Type[Type["Water"] = 4] = "Water";
        Type[Type["Yeast"] = 5] = "Yeast";
    })(Supply.Type || (Supply.Type = {}));
    var Type = Supply.Type;
    function allIngredientTypes() {
        return [
            Type.Dynamic,
            Type.Fermentable,
            Type.Hops,
            Type.Miscellaneous,
            Type.Water,
            Type.Yeast
        ];
    }
    Supply.allIngredientTypes = allIngredientTypes;
    var Ing = (function () {
        function Ing(iri, type, dimensions) {
            this.iri = iri;
            this.type = type;
            this.dimension = dimensions;
        }
        Ing.prototype.getRef = function () { return this.iri; };
        Ing.prototype.getType = function () { return this.type; };
        Ing.prototype.getDimension = function () { return this.dimension; };
        Ing.prototype.toString = function () { return this.ref.name; };
        return Ing;
    }());
    Supply.Ing = Ing;
})(Supply || (Supply = {}));
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
}());
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
}());
var StepType = (function () {
    function StepType() {
    }
    StepType.addIngredient = OntoRef.createAnon('Add Ingredient');
    StepType.defineOutput = OntoRef.createAnon('Define Output');
    StepType.ferment = OntoRef.createAnon('Ferment');
    StepType.heating = OntoRef.createAnon('Change of Temp.');
    StepType.merging = OntoRef.createAnon('Merging');
    StepType.splitting = OntoRef.createAnon('Splitting');
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
}());
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
}());
var Ingredients = (function () {
    function Ingredients() {
        this.inventory = [];
        this.reactors = [];
    }
    Ingredients.prototype.listAllIngredients = function () {
        return [].concat(this.inventory);
    };
    Ingredients.prototype.getFromInventory = function (ref) {
        return this.inventory.filter(function (ing) { return ing.iri === ref; });
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
}());
var Equipment = (function () {
    function Equipment(data) {
        var _this = this;
        Object.keys(data).forEach(function (key) {
            _this[key] = data[key];
        });
    }
    return Equipment;
}());
var Equipments = (function () {
    function Equipments() {
    }
    Equipments.getAll = function () {
        return Equipments.all;
    };
    Equipments.byRef = function (ref) {
        return Equipments.equipByRef[ref];
    };
    Equipments.onServerLoaded = function (server) {
        Log.info('Equipments', 'Loading Equipments');
        server.getEquipments()
            .then(Equipments.load)
            .then(bus.thenPublish(MessageType.EquipmentsLoaded));
    };
    Equipments.load = function (data) {
        Equipments.all = data.map(function (d) { return new Equipment(d); });
        Equipments.all.forEach(function (e) { return Equipments.equipByRef[e.ref] = e; });
        Log.info("Equipments", Object.keys(Equipments.all).length + " Equipments loaded");
    };
    Equipments.all = [];
    Equipments.equipByRef = {};
    return Equipments;
}());
bus.suscribe(MessageType.ServerConnected, function (server) { Equipments.onServerLoaded(server); }, null);
var Style = (function () {
    function Style(refGuide, category, style) {
        if (refGuide === void 0) { refGuide = ''; }
        this.ref = style.ref;
        this.refCategory = category.ref;
        this.refGuide = refGuide;
        this.categoryCode = category.code;
        this.styleCode = style.code;
        this.name = 'unimplemented';
    }
    Style.prototype.getRef = function () {
        return this.ref;
    };
    Style.prototype.toString = function () {
        return this.ref + ' - ' + this.styleCode + ' - ' + this.categoryCode;
    };
    return Style;
}());
var Styles;
(function (Styles) {
    var allGuides;
    var allStyles;
    var styleByRef = {};
    function getAll() {
        return allStyles;
    }
    Styles.getAll = getAll;
    function byRef(ref) {
        return styleByRef[ref];
    }
    Styles.byRef = byRef;
    function onServerLoaded(server) {
        var _this = this;
        Log.info("Styles", "Loading Styles");
        server.getStyles()
            .then(function (data) { allGuides = data; })
            .then(loadStyles)
            .then(function () { bus.publish(MessageType.StylesLoaded, _this); });
    }
    function loadStyles() {
        var styleMap = {};
        var categoryMap = {};
        allGuides.forEach(function (guide) {
            guide.styles.forEach(function (s) { styleMap[s.ref] = s; });
            guide.categories.forEach(function (c) { categoryMap[c.ref] = c; });
        });
        allStyles = _.flatten(_.map(allGuides, function (guide) { return _.flatten(_.map(guide.categories, function (category) { return _.flatten(_.map(category.styles, function (style) { return new Style(guide.ref, category, styleMap[style]); })); })); }));
        allStyles.forEach(function (s) { styleByRef[s.getRef()] = s; });
        Log.info("Styles", allGuides.length + " Guides and " + Object.keys(allStyles).length + " Styles loaded");
    }
    bus.suscribe(MessageType.ServerConnected, function (server) { onServerLoaded(server); }, null);
})(Styles || (Styles = {}));
var StepImplType;
(function (StepImplType) {
    StepImplType[StepImplType["equipment"] = 0] = "equipment";
    StepImplType[StepImplType["ingredient"] = 1] = "ingredient";
    StepImplType[StepImplType["heating"] = 2] = "heating";
    StepImplType[StepImplType["cooling"] = 3] = "cooling";
    StepImplType[StepImplType["fermenting"] = 4] = "fermenting";
    StepImplType[StepImplType["miscellaneous"] = 5] = "miscellaneous";
    StepImplType[StepImplType["processTarget"] = 6] = "processTarget";
    StepImplType[StepImplType["unknown"] = 7] = "unknown";
})(StepImplType || (StepImplType = {}));
var TempTarget = (function () {
    function TempTarget(magnitude, unit) {
        this.quantity = new Quantity(magnitude, unit);
    }
    TempTarget.getBoil = function () {
        return new TempTarget(100, SU("°C"));
    };
    TempTarget.prototype.toString = function () {
        return 'Temp target at ' + this.quantity.toString();
    };
    TempTarget.prototype.encode = function () {
        return {
            type: 'TempTarget',
            quantity: this.quantity.encode()
        };
    };
    return TempTarget;
}());
var TimeTarget = (function () {
    function TimeTarget(magnitude, unit) {
        this.quantity = new Quantity(magnitude, unit);
    }
    TimeTarget.prototype.toString = function () {
        return 'Time target at ' + this.quantity.toString();
    };
    TimeTarget.prototype.encode = function () {
        return {
            type: 'TimeTarget',
            quantity: this.quantity.encode()
        };
    };
    return TimeTarget;
}());
var StepImpl = (function () {
    function StepImpl(name, type, recipe) {
        if (type === void 0) { type = StepImplType.unknown; }
        this.name = name;
        this.type = type;
        this.recipe = recipe;
        this.id = StepImpl.uid++;
    }
    StepImpl.prototype.toJSON = function () {
        this.recipe = undefined;
        return this;
    };
    StepImpl.uid = 0;
    return StepImpl;
}());
var ProcessStepTarget = (function (_super) {
    __extends(ProcessStepTarget, _super);
    function ProcessStepTarget(name, parent, recipe) {
        _super.call(this, name, StepImplType.processTarget, recipe);
        this.ingredients = [];
        this.parent = parent;
    }
    ProcessStepTarget.prototype.addIng = function (name, ingredient, quantity) {
        this.ingredients.push(new IngredientStep(name, ingredient, quantity, this.recipe));
        return this;
    };
    ProcessStepTarget.prototype.onBegin = function () { return this.parent.onBegin(); };
    ProcessStepTarget.prototype.toEnd = function (target) { return this.parent.toEnd(target); };
    ProcessStepTarget.prototype.onEnd = function () { return this.parent.onEnd(); };
    ProcessStepTarget.prototype.getIng = function () {
        return this.ingredients;
    };
    ProcessStepTarget.prototype.toString = function () {
        return this.name;
    };
    ProcessStepTarget.prototype.toJSON = function () {
        this.recipe = undefined;
        this.parent = undefined;
        return this;
    };
    ProcessStepTarget.prototype.encode = function () {
        return {
            type: this.type,
            tmpName: this.name,
            ingredients: this.ingredients.map(function (e) { return e.encode(); })
        };
    };
    return ProcessStepTarget;
}(StepImpl));
var ProcessStep = (function (_super) {
    __extends(ProcessStep, _super);
    function ProcessStep(name, type, recipe, target) {
        if (type === void 0) { type = StepImplType.unknown; }
        _super.call(this, name, type, recipe);
        this.isProcess = true;
        this.target = target;
        this.targets = [
            new ProcessStepTarget('begin ' + target.toString(), this, recipe),
            new ProcessStepTarget('end ' + target.toString(), this, recipe)
        ];
    }
    ProcessStep.prototype.getTargets = function () {
        return this.targets;
    };
    ProcessStep.prototype.onBegin = function () {
        return this.targets[0];
    };
    ProcessStep.prototype.onEnd = function () {
        return this.targets[this.targets.length - 1];
    };
    ProcessStep.prototype.toEnd = function (target) {
        var t = new ProcessStepTarget(target.toString() + " until target", this, this.recipe);
        this.targets.splice(this.targets.length - 1, 0, t);
        return t;
    };
    ProcessStep.prototype.encode = function () {
        return {
            target: this.target.encode,
            targets: this.targets.map(function (t) { return t.encode(); })
        };
    };
    return ProcessStep;
}(StepImpl));
var CoolingStep = (function (_super) {
    __extends(CoolingStep, _super);
    function CoolingStep(name, recipe, target) {
        _super.call(this, name, StepImplType.cooling, recipe, target);
    }
    return CoolingStep;
}(ProcessStep));
var EquipmentStep = (function (_super) {
    __extends(EquipmentStep, _super);
    function EquipmentStep(equipment, recipe) {
        _super.call(this, equipment.ref, StepImplType.equipment, recipe);
        this.equipment = equipment;
        this.steps = [];
    }
    EquipmentStep.prototype.addIng = function (name, ingredient, quantity) {
        this.steps.push(new IngredientStep(name, ingredient, quantity, this.recipe));
        return this;
    };
    EquipmentStep.prototype.heat = function (name, target) {
        this.steps.push(new ProcessStep(name, StepImplType.heating, this.recipe, target));
        return this;
    };
    EquipmentStep.prototype.getHeat = function () {
        return this.steps.filter(function (s) { return s.type == StepImplType.heating; });
    };
    EquipmentStep.prototype.getSteps = function () {
        return this.steps;
    };
    EquipmentStep.prototype.getFerm = function () {
        return this.steps.filter(function (s) { return s.type == StepImplType.fermenting; });
    };
    EquipmentStep.prototype.cool = function (name, target) {
        return this;
    };
    EquipmentStep.prototype.transferTo = function (newEquipment, characteristics) {
        return this.recipe.insertAfter(new EquipmentStep(newEquipment, this.recipe), this);
    };
    EquipmentStep.prototype.ferment = function (name, target) {
        this.steps.push(new FermentationStep(name, StepImplType.fermenting, this.recipe, target));
        return this;
    };
    EquipmentStep.prototype.encode = function () {
        return {
            steps: this.steps.map(function (s) {
                return s.encode != null ? s.encode() : null;
            }),
            equipment: this.equipment != null ? this.equipment.ref : null
        };
    };
    return EquipmentStep;
}(StepImpl));
var FermentationStep = (function (_super) {
    __extends(FermentationStep, _super);
    function FermentationStep(name, type, recipe, target) {
        _super.call(this, name, type, recipe, target);
    }
    return FermentationStep;
}(ProcessStep));
var HeatingStep = (function (_super) {
    __extends(HeatingStep, _super);
    function HeatingStep() {
        _super.apply(this, arguments);
    }
    return HeatingStep;
}(ProcessStep));
var IngredientStep = (function (_super) {
    __extends(IngredientStep, _super);
    function IngredientStep(name, ingredient, qty, recipe) {
        _super.call(this, name, StepImplType.ingredient, recipe);
        this.ingredient = ingredient;
        this.qty = qty;
    }
    IngredientStep.prototype.encode = function () {
        return {
            ingredient: this.ingredient != null ? this.ingredient.getRef() : null,
            qty: this.qty != null ? this.qty.encode() : null
        };
    };
    return IngredientStep;
}(StepImpl));
var MiscStepType;
(function (MiscStepType) {
    MiscStepType[MiscStepType["Decantation"] = 0] = "Decantation";
    MiscStepType[MiscStepType["Moderate_Aeration"] = 1] = "Moderate_Aeration";
})(MiscStepType || (MiscStepType = {}));
var MiscStep = (function (_super) {
    __extends(MiscStep, _super);
    function MiscStep(name, action, recipe) {
        _super.call(this, name, StepImplType.miscellaneous, recipe);
        this.action = action;
    }
    return MiscStep;
}(StepImpl));
var Recipe = (function () {
    function Recipe(base) {
        if (base == null)
            Log.error("Recipe", "Must provide an equipment.");
        this.id = 'unimplemented';
        this.reactors = [
            new EquipmentStep(base, this)
        ];
    }
    Recipe.prototype.getReactors = function () {
        return this.reactors;
    };
    Recipe.prototype.getGroupedByEquipment = function () {
        var processGroup = [];
        var lastProcessIdx = 0;
        for (var i = 0; i < this.reactors.length; i++) {
            if (this.reactors[i].type == StepImplType.equipment && i !== lastProcessIdx) {
                processGroup.push(this.reactors.slice(lastProcessIdx, i));
                lastProcessIdx = i;
            }
        }
        if (lastProcessIdx !== this.reactors.length) {
            processGroup.push(this.reactors.slice(lastProcessIdx, this.reactors.length));
        }
        return processGroup;
    };
    Recipe.prototype.insertAfter = function (newStep, afterThis) {
        var idx = this.reactors.indexOf(afterThis);
        if (idx === -1)
            Log.warn("Recipe", "Inserting in an unknown idx.");
        this.reactors.splice(idx + 1, 0, newStep);
        return newStep;
    };
    Recipe.prototype.addEquipment = function (v) {
        this.reactors.push(v);
        return this;
    };
    Recipe.prototype.encode = function () {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            style: this.style != null ? this.style.getRef() : null,
            reactors: this.reactors.map(function (r) { return r.encode(); })
        };
    };
    return Recipe;
}());
var Shortcut = (function () {
    function Shortcut() {
    }
    return Shortcut;
}());
var Shortcuts = (function () {
    function Shortcuts() {
        this.all = [];
        this.map = {};
    }
    Shortcuts.prototype.hasKey = function (key) {
        return this.map[key.toString()] !== undefined;
    };
    Shortcuts.prototype.get = function (key) {
        return this.map[key.toString()];
    };
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
}());
var ItemType;
(function (ItemType) {
    ItemType[ItemType["Fermentables"] = 0] = "Fermentables";
    ItemType[ItemType["Hops"] = 1] = "Hops";
    ItemType[ItemType["Yeasts"] = 2] = "Yeasts";
    ItemType[ItemType["Miscellaneous"] = 3] = "Miscellaneous";
    ItemType[ItemType["Dynamics"] = 4] = "Dynamics";
})(ItemType || (ItemType = {}));
;
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
}());
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
}());
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
}());
//# sourceMappingURL=brew.js.map