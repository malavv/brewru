/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />
var ShortcutBehaviorImpl = {
    __shortcuts: [],
    properties: {},
    keyBindings: {},
    attached: function () {
        this.keyEventTarget = document.body;
    },
    addShortcut: function (binding, type) {
        this.addOwnKeyBinding(binding, '_keyPressed');
        this.__shortcuts.push({
            binding: binding,
            type: type
        });
    },
    _keyPressed: function (evt) {
        this.__shortcuts
            .filter(function (s) { return this.keyboardEventMatchesKeys(evt.detail.keyboardEvent, s.binding); }, this)
            .forEach(function (s) { bus.publish(s.type); }, this);
    }
};
var ShortcutBehavior = [Polymer.IronA11yKeysBehavior, ShortcutBehaviorImpl];
