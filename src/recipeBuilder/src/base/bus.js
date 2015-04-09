define(
	[],
	function() {

  window.bus = new EventBus();

  function Handler(obj, callback, types) {
    this.obj = obj;
    this.callback = callback;
    this.types = Array.isArray(types) ? types : [types];
  }

  function EventBus() {
    this.handlers = [];
  }

  EventBus.prototype.broadcast = function(type, data) {
    type = type || 'unknown';
    data = data || null;

    this.handlers
      .filter(handlesType(type))
      .forEach(function(handler) { handler.callback.call(handler.obj, data); }, this);
  };

  EventBus.prototype.register = function(obj, callback, types) {
    if (!(obj instanceof Object)) {
      console.error('[\'Event Bus\']Invalid handler');
      return;
    }
    if (!(callback instanceof Function)) {
      console.error('[\'Event Bus\']Invalid handler');
      return;
    }
    this.types = Array.isArray(types) ? types : [types];
    this.handlers.push(new Handler(obj, callback, types));
  };

  function handlesType(type) {
    return function(handler) {
      return handler.types.filter(function(e) { return e === type;}).length > 0;
    };
  }

  return EventBus;
});