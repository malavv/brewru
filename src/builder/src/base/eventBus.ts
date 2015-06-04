/// <reference path="messageType.ts" />

class EventBus {
	private byEventType: { [type:number]: Array<Object> } = {};
	private allSuscribers: Array<Object> = [];
	
	/**
	 * When true the bus will log all events on the console.
	 */
	isLogging: boolean = false;
	
	/**
	 * Sends an event to all potential suscribers
	 * @param type Type of the event from EventType
	 * @param data Any relevant data.
	 */
	publish(type: MessageType, data: any) {
		(this.byEventType[type.id] || [])
			.forEach((handler) => { this.trigger(handler, type, data); });
		this.log(type, data);
	}
	
	/**
	 * Suscribe to a type of events.
	 * @param handler Object that will handle the message.
	 * @param types Types of message to register to.
	 */
	suscribe(handler: Object, types: Array<MessageType>) {
		if (this.isKnown(handler)) {
			console.warn('[EventBus] Registering a known handler');
		}
		this.allSuscribers.push(handler);
		types.forEach((type:MessageType) => {
			this.byEventType[type.id] = this.byEventType[type.id] || [];
			this.byEventType[type.id].push(handler);
		});
	}
	
	/**
	 * Is the handler known of the EventBus.
	 */
	isKnown(handler: Object) {
		return this.allSuscribers.some((s) => { return s === handler; });
	}
	
	private log(type: MessageType, data: any) {
		console.log('[EventBus]', type, data);
	}
	private trigger(handler: Object, type: MessageType, data: any) {
		var prop = 'on' + type.name; 
		handler[prop].call(handler, data);
	}
}