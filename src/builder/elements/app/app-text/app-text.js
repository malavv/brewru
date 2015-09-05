/// <reference path="../../../src/defs/polymer/polymer.ts" />
/// <reference path="../../../src/base/eventBus.ts" />
/**
 * Part of the Wizard functionalities, serves to ask a text input.
 *
 * Send in a description of the text you want and receive an
 * object having the description you send in and a value which is
 * null on cancel or contains the answer if user gave one.
 */
var AppText = (function () {
    function AppText() {
        this.is = 'app-text';
    }
    AppText.prototype.ready = function () {
        // Ask is the message leading to this wizard being shown
        bus.suscribe(MessageType.AskText, this.focus, this);
        // Cancel shuts down gracefully the wizard.
        bus.suscribe(MessageType.Cancel, this.cancel, this);
        this.reset();
    };
    /** Handles both a cancel msg or user clicking elsewhere. */
    AppText.prototype.cancel = function () {
        if (this.$.overlay.opened)
            this.$.overlay.close();
        bus.publish(MessageType.AnswerText, {
            description: this.description,
            value: null
        });
    };
    /** Handle initialization of the wizard. */
    AppText.prototype.focus = function (data) {
        this.reset();
        this.description = data.description;
        this.$.overlay.open();
    };
    /** When user enters something usefull and presses enter. */
    AppText.prototype.committedChanged = function (oldVal, newVal) {
        if (newVal === '')
            return;
        this.$.overlay.close();
        bus.publish(MessageType.AnswerText, {
            description: this.description,
            value: this.value
        });
    };
    /** Resets field to start again */
    AppText.prototype.reset = function () {
        this.description = '';
        this.value = '';
        this.wasCanceled = true;
    };
    AppText.isRegistered = false;
    return AppText;
})();
