/// <reference path="../../../src/base/eventBus.ts" />

var Polymer:Function = Polymer || function () {}

/**
 * Part of the Wizard functionalities, serves to ask a text input.
 * 
 * Send in a description of the text you want and receive an
 * object having the description you send in and a value which is
 * null on cancel or contains the answer if user gave one.
 */
class AppText {
  $:any;
  description:string;
  value:string;
  wasCanceled:boolean;
  
  ready() {
    // Ask is the message leading to this wizard being shown
    bus.suscribe(MessageType.AskText, this.initAndShow, this);
    // Cancel shuts down gracefully the wizard.
    bus.suscribe(MessageType.Cancel, this.cancel, this);
    
    this.reset();
  }
  
  /** Handles both a cancel msg or user clicking elsewhere. */
  cancel() {
    if (this.$.overlay.opened) this.$.overlay.close();
    bus.publish(MessageType.AnswerText, {
      description: this.description,
      value: null
    });
  }
  
  /** Handle initialization of the wizard. */
  initAndShow(data:string) {
    this.reset();
    this.description = data;
    this.$.overlay.open();
  }
  
  /** When user enters something usefull and presses enter. */
  committedChanged(oldVal:string, newVal:string) {
    if (newVal === '') return;
    this.$.overlay.close();
    bus.publish(MessageType.AnswerText, {
      description: this.description,
      value: this.value
    });
  }
  
  /** Resets field to start again */
  private reset() {
    this.description = '';
    this.value = '';
    this.wasCanceled = true;
  }
}  

Polymer(AppText.prototype);