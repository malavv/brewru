var HelloWorld = (function () {
    function HelloWorld() {
    }
    HelloWorld.prototype.welcome = function () {
        console.log('[HelloWorld] Hello World!');
    };
    return HelloWorld;
})();
var MessageType = (function () {
    function MessageType(name, id) {
        this.name = name;
        this.id = id;
    }
    MessageType.unknown = new MessageType('Unknown', 0);
    return MessageType;
})();
;
/// <reference path="messageType.ts" />
var EventBus = (function () {
    function EventBus() {
        this.byEventType = {};
        this.allSuscribers = [];
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
        (this.byEventType[type.id] || []).forEach(function (handler) {
            _this.trigger(handler, type, data);
        });
        this.log(type, data);
    };
    /**
     * Suscribe to a type of events.
     * @param handler Object that will handle the message.
     * @param types Types of message to register to.
     */
    EventBus.prototype.suscribe = function (handler, types) {
        var _this = this;
        if (this.isKnown(handler)) {
            console.warn('[EventBus] Registering a known handler');
        }
        this.allSuscribers.push(handler);
        types.forEach(function (type) {
            _this.byEventType[type.id] = _this.byEventType[type.id] || [];
            _this.byEventType[type.id].push(handler);
        });
    };
    /**
     * Is the handler known of the EventBus.
     */
    EventBus.prototype.isKnown = function (handler) {
        return this.allSuscribers.some(function (s) {
            return s === handler;
        });
    };
    EventBus.prototype.log = function (type, data) {
        console.log('[EventBus]', type, data);
    };
    EventBus.prototype.trigger = function (handler, type, data) {
        var prop = 'on' + type.name;
        handler[prop].call(handler, data);
    };
    return EventBus;
})();
