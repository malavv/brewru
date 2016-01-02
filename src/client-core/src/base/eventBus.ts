/// <reference path="messageType.ts" />
/// <reference path="../defs/es6-promise/es6-promise.d.ts" />

interface HandlerFunc {
	(data: any): void;
}

class Suscriber {
	obj: Object;
	fn: HandlerFunc;
	type: MessageType;
}

class EventBus {
	private byType: { [type:number]: Array<Suscriber> } = {};
	
	/**
	 * When true the bus will log all events on the console.
	 */
	isLogging: boolean = true;
	
	/**
	 * Sends an event to all potential suscribers
	 * @param type Type of the event from EventType
	 * @param data Any relevant data.
	 */
	publish(type: MessageType, data?: any) {
		(this.byType[type.id] || [])
			.forEach((handler) => { this.trigger(handler, data); });
		this.log(type, data);
	}
	
	/**
	 * Suscribe to a type of events.
	 * @param handler Object that will handle the message.
	 * @param types Types of message to register to.
	 */
	suscribe(type: MessageType, callback: HandlerFunc, optThis: Object) {
		this.byType[type.id] = this.byType[type.id] || [];
		this.byType[type.id].push({
			obj: optThis || Window,
			fn: callback,
			type: type
		});
	}
	
	/**
	 * Publish a message and waits for an answer. 
	 */
	publishAndWaitFor(waitForType: MessageType, publishType: MessageType, data?: any) {
		return new Promise((resolve, reject) => {
			this.suscribe(waitForType, (data) => { resolve(data); }, this);
			this.publish(publishType, data);
		});
	}
	
	private log(type: MessageType, data: any) {
		if (this.isLogging) console.log('[EventBus]', type, data);
	}
	private trigger(handler: Suscriber, data: any) {
		handler.fn.call(handler.obj, data);
	}
}

var bus = new EventBus();