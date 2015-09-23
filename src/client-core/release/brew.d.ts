/// <reference path="../es6-promise/es6-promise.d.ts" />
interface ConceptRef {
    isAnon: boolean;
    ref: string;
    name: string;
}
declare class OntoRef implements ConceptRef {
    private static nextAnonRef;
    ref: string;
    isAnon: boolean;
    name: string;
    constructor(ref: string, name: string);
    toString(): string;
    static createAnon(name: string): ConceptRef;
    static create(ref: string, name: string): ConceptRef;
}
declare class Entities {
    static tapWater: ConceptRef;
    static inventory: ConceptRef;
    static kg: ConceptRef;
    static liter: ConceptRef;
    static syrup: ConceptRef;
    static dme: ConceptRef;
    static c120: ConceptRef;
    static c60: ConceptRef;
    static paleChoco: ConceptRef;
    static blackMalt: ConceptRef;
    static flakedRye: ConceptRef;
    static rolledOat: ConceptRef;
    static yeastNutrient: ConceptRef;
    static w2112: ConceptRef;
}
declare class CancelError implements Error {
    name: string;
    message: string;
}
declare class UnimplementedError implements Error {
    name: string;
    message: string;
}
declare class InvalidStateError implements Error {
    name: string;
    message: string;
}
/**
 * Represents a unit dimension.
 *
 * Whether it is a unit of mass, a unit of length, ...
 */
declare class Dim {
    static Length: Dim;
    static Mass: Dim;
    static Temperature: Dim;
    static Volume: Dim;
    static Temporal: Dim;
    static all(): Dim[];
}
declare module Supply {
    class IngType {
        static Fermentable: IngType;
        static Hops: IngType;
        static Yeast: IngType;
        static Miscellaneous: IngType;
        static Dynamic: IngType;
        static all(): IngType[];
        name: string;
        constructor(name: string);
        static of(name: string): IngType;
        toString(): string;
    }
    /**
     * Represents the abstract concept of certain ingredient.
     *
     * For example, Hallertauer is a base ingredient but Hallertauer (us)
     * from a certain place and having a certain AA is a Ingredient.
     */
    class BaseIng {
        private _type;
        private _dimensions;
        ref: ConceptRef;
        constructor(concept: ConceptRef, type: IngType, dimensions?: Array<Dim>);
        type(): IngType;
        dimensions(): Array<Dim>;
        toString(): string;
    }
    /**
     * Represent an ingredient but not its associated supplies.
     */
    class Ing extends BaseIng {
        constructor(concept: ConceptRef, type: IngType, dimensions?: Array<Dim>);
        toString(): string;
    }
}
declare class IngredientSrc {
    concept: ConceptRef;
    stocks: Array<Supply.Ing>;
    constructor(concept: ConceptRef);
    addAll(items: Array<Supply.Ing>): IngredientSrc;
}
/** This will need to be reviewed with specific sub-classes. */
declare class Step {
    private static idx;
    id: string;
    name: string;
    type: ConceptRef;
    constructor(name: string, type: ConceptRef, id?: string);
    toString(): string;
}
/**
 * Step type object for easy autocomplete.
 *
 * Should be filled from the ontology and should be used using the Step object.
 */
declare class StepType {
    static addIngredient: ConceptRef;
    static defineOutput: ConceptRef;
    static ferment: ConceptRef;
    static heating: ConceptRef;
    static merging: ConceptRef;
    static splitting: ConceptRef;
    static start: ConceptRef;
    static All: Array<ConceptRef>;
}
declare class Reactor {
    private static nextIdx;
    id: number;
    name: string;
    steps: Array<Step>;
    constructor(id?: number, name?: string, steps?: Array<Step>);
    addAfter(lhs: any, newObj: any): void;
    static createAnon(): Reactor;
    static isReactor(reactor: Reactor): boolean;
    private static nextId();
}
declare class Ingredients {
    inventory: Array<Supply.Ing>;
    reactors: Array<Reactor>;
    listAllIngredients(): any[];
    getFromInventory(concept: ConceptRef): Supply.Ing[];
    addToInventory(ingredient: Supply.Ing): void;
    addSrc(reactor: Reactor): void;
}
declare class Recipe {
    name: string;
    reactors: Array<Reactor>;
    constructor(name?: string, reactors?: Array<Reactor>);
    addReactor(reactor: Reactor): void;
    listDynamicIngredients(): Supply.Ing[];
    private _getOutput(last, elem);
    encode(): Object;
    static decode(o: {
        [key: string]: any;
    }): Recipe;
    private static _decodeReactor(o);
    private static _decodeStep(o);
    private static _decodeRef(o);
}
declare class Keyboard {
    private event;
    binding: string;
    constructor(event: KeyboardEvent);
    toString(): string;
    static fromEvt(event: KeyboardEvent): Keyboard;
    static getKeyBinding(event: KeyboardEvent): string;
    static getCodeName(code: number): string;
}
/**
 * Defines a shortcut with a possible binding.
 *
 * Used to bind a certain key combination with a SubPub message.
 */
declare class Shortcut {
    /** A string representing the key combination. */
    binding: string;
    /** Basic description of the action expected. less than 80 char. */
    description: string;
    /** The message that will be sent on event. */
    intent: MessageType;
}
/**
 * Manager of shortcuts, no method is static. Use default for main instance.
 */
declare class Shortcuts {
    /** List of all bound Shortcuts. */
    all: Array<Shortcut>;
    /** Map of binding to Shortcut. */
    map: {
        [map: string]: Shortcut;
    };
    hasKey(key: Keyboard): boolean;
    get(key: Keyboard): Shortcut;
    /** Chainable method to add a Shortcut to this manager. */
    add(binding: string, intent: MessageType, description: string): Shortcuts;
}
declare module base {
    /** Allows to encode a number to a different base. */
    interface BaseConvert {
        /**
         * Converts the index to its base equivalent.
         * @param idx Number to converts
         */
        toCode(idx: number): string;
        /**
         * Converts the code back into its associated index.
         * @param base Base to convert back.
         */
        toIdx(base: string): number;
    }
    /**
     * Provides codes that are easily accessible from  a keyboard.
     *
     * Useful when providing keyboard shortcuts to the user.
     */
    class KeyboardBase implements BaseConvert {
        private static codes;
        private static errorCode;
        private static errorIdx;
        toCode(idx: number): string;
        toIdx(base: string): number;
        private static isIdxValid(idx);
        private static isCodeValid(base);
    }
}
declare class MessageType {
    name: string;
    id: number;
    constructor(name: string, id: number);
    static unknown: MessageType;
    static NewStepCreated: MessageType;
    static RecipeChanged: MessageType;
    static AskIngredient: MessageType;
    static AnswerIngredient: MessageType;
    static ShowShortcuts: MessageType;
    static CreateStep: MessageType;
    static Cancel: MessageType;
    static AskMenu: MessageType;
    static AnswerMenu: MessageType;
    static AskText: MessageType;
    static AnswerText: MessageType;
    static AskQuantity: MessageType;
    static AnswerQuantity: MessageType;
    static ServerConnected: MessageType;
    static UnsuccessfulConnection: MessageType;
    static InventoryChanged: MessageType;
    static StatusUpdate: MessageType;
}
interface HandlerFunc {
    (data: any): void;
}
declare class Suscriber {
    obj: Object;
    fn: HandlerFunc;
    type: MessageType;
}
declare class EventBus {
    private byType;
    /**
     * When true the bus will log all events on the console.
     */
    isLogging: boolean;
    /**
     * Sends an event to all potential suscribers
     * @param type Type of the event from EventType
     * @param data Any relevant data.
     */
    publish(type: MessageType, data?: any): void;
    /**
     * Suscribe to a type of events.
     * @param handler Object that will handle the message.
     * @param types Types of message to register to.
     */
    suscribe(type: MessageType, callback: HandlerFunc, optThis: Object): void;
    /**
     * Publish a message and waits for an answer.
     */
    publishAndWaitFor(waitForType: MessageType, publishType: MessageType, data?: any): Promise<{}>;
    private log(type, data);
    private trigger(handler, data);
}
declare var bus: EventBus;
declare class Unit {
    concept: ConceptRef;
    symbol: string;
    offset: number;
    multiplier: number;
    dimension: Dim;
    system: UnitSystem;
    constructor(concept: ConceptRef, symbol: string, offset: number, multiplier: number, dim: Dim, system: UnitSystem);
    toString(): string;
    static Unknown: Unit;
}
declare class Quantity {
    magnitude: number;
    unit: Unit;
    constructor(magnitude: number, unit: Unit);
    toString(): string;
}
declare class ListNode {
    payload: any;
    next: ListNode;
    last: ListNode;
    constructor(payload: any);
}
declare class List {
    begin: ListNode;
    end: ListNode;
    push(payload: any): List;
}
/**
 * Server proxy object which serves as an Object that could be queried from JS.
 */
interface Server {
    /** Whether a server is connected. Can be null. */
    isConnected: Boolean;
    endpoint(): string;
    syncInventory(): Promise<Object>;
}
declare class ServerImpl {
    /** Whether a server is connected. Can be null. */
    isConnected: Boolean;
    private ws;
    private url;
    private clientId;
    private packetIdCounter;
    private timeoutMs;
    private communications;
    endpoint(): string;
    syncInventory(): Promise<Object>;
    constructor(endpoint: string);
    private _onClose();
    private _onError();
    private _onMessage(msg);
    private _onOpen();
}
declare enum ItemType {
    Fermentables = 0,
    Hops = 1,
    Yeasts = 2,
    Miscellaneous = 3,
    Dynamics = 4,
}
declare class Stock {
    item: Item;
    quantity: Quantity;
    boughtOn: Date;
    provider: String;
    static fromRaw(item: Item, raw: any): Stock;
}
declare class Item {
    type: ItemType;
    name: string;
    ref: string;
    stocks: Stock[];
    static fromRaw(raw: any): Item;
}
/**
 * The inventory is a collection of items having types and which can be part of stocks.
 *
 * Fermentables, for examples, is a type of items. A certain quantity of an item, purchased
 * at a certain time, from a certain supplier is a stock.
 */
declare class Inventory {
    private items;
    private stocks;
    constructor();
    listItem(type?: ItemType): Item[];
    addItem(item: Item): void;
}
declare class SystemImpl {
    private units;
    name: string;
    constructor(name: string, units: Array<Unit>);
    sym(symbol: string): Unit;
    dim(dim: Dim): Array<Unit>;
    getById(id: string): Unit;
}
declare class UnitSystem {
    static SI: SystemImpl;
    static UsCust: SystemImpl;
    static Imperial: SystemImpl;
    static all(): Array<SystemImpl>;
    static getUnit(id: string): Unit;
}
declare var SI: SystemImpl, UsCust: SystemImpl, Imperial: SystemImpl;
