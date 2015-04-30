requirejs.config({
    shim: {
        underscore: {
            exports: '_'
        }
    },
    paths: {
        underscore: '../bower_components/underscore/underscore',
        d3: ['//d3js.org/d3.v3.min', '../lib/d3.v3.min']
    },
    baseUrl: 'src'
});

require(['underscore'], function(_) {
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };
});

Object.watchedProperty = function(obj, property, value) {
  if (typeof(property) !== "string") {
   console.warn('[Object] watchedProperty : Invalid property name');
   return;
  }
  var
    internalAttr = '_' + property,
    changedAttr = property + 'Changed';
  obj[internalAttr] = value;
  Object.defineProperty(obj, property, {
    enumerable: false,
    get: function() { return obj[internalAttr]; },
    set: function(newVal) {
      var
        old = obj[internalAttr],
        changed = obj[changedAttr];
      obj[internalAttr] = newVal;
      if (changed instanceof Function) changed.call(obj, old, newVal);
    }
  });
};