/// <reference path="messageType.ts" />
/// <reference path="../../lib/es6-promise/es6-promise.d.ts" />

interface HandlerFunc {
	(data: any): void;
}

class Suscriber {
	obj: Object;
	fn: HandlerFunc;
	type: MessageType;
}

class Bus {
	private byType: { [type:number]: Array<Suscriber> } = {};

	/**
	 * When true the bus will log all events on the console.
	 */
	isLogging:boolean = false;

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

	thenPublish(type: MessageType) {
		return () => { this.publish(type); }
	}

	/**
	 * Suscribe to a type of events.
	 * @param handler Object that will handle the message.
	 * @param types Types of message to register to.
	 */
  suscribe(type:MessageType, callback:HandlerFunc, optThis?:Object) {
		this.byType[type.id] = this.byType[type.id] || [];
		this.byType[type.id].push({
			obj: optThis || Window,
			fn: callback,
			type: type
		});
	}

  /**
   * Registers to receive result of the first message of this type.
   * @param type Type to be warned of
   * @returns {Promise}
   */
  onFirstMsg(type : MessageType) : Promise<Object> {
    return new Promise((resolve, reject) => {
      this.suscribe(type, resolve);
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

let bus = new Bus();
