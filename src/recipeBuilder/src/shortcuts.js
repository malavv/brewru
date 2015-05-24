define([
],
function() {
  'use strict';

  function Shortcuts() {
    this.all = [];
    this.map = {};
  }

  Shortcuts.prototype.add = function(binding, name, intent) {
    var newShortcut = {
      binding: binding,
      name: name,
      intent: intent
    };
    this.all.push(newShortcut);
    this.map[binding] = newShortcut;
    return this;
  };

  return new Shortcuts()
    .add('alt+S', 'Create new step', 'CreateStep')
    .add('shift+6', 'Toggle Visibility of Shortcuts', 'Shortcuts')
    .add('esc', 'Cancel current action.', 'Cancel');
});