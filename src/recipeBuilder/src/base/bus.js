define(
	[],
	function() {

  window.bus = new EventBus();

  function Handler(obj, types) {
    this.obj = obj;
    this.types = Array.isArray(types) ? types : [types];
  }

  function EventBus() {
    this.handlers = [];
    this.debug = false;
  }

  EventBus.prototype.broadcast = function(type, data) {
    type = type || 'unknown';
    data = data || null;

    this.handlers
      .filter(handlesType(type))
      .forEach(function(h) {
        h.obj['on' + type].call(h.obj, data);
      }, this);
    if (this.debug) console.info('EventBus', type, data);
  };

  EventBus.prototype.register = function(obj, types) {
    if (obj instanceof Object) {
      this.types = Array.isArray(types) ? types : [types];
      this.handlers.push(new Handler(obj, types));
      return;
    }
    console.error('[\'Event Bus\']Invalid handler');
  }

  function handlesType(type) {
    return function(handler) {
      return handler.types.filter(function(e) { return e === type;}).length > 0;
    };
  }

  return EventBus;
});