/// <reference path="../../../src/base/eventBus.ts" />

var Polymer:Function = Polymer || function () {}

class AppText {
  busRequest= 'AskText';
  busCancel= 'Cancel';
  evtSend= 'AnswerText';
  description= '';
  wasCanceled= true;
  $:any;
  value:any;
  
  ready() {
    bus.suscribe(MessageType.AskText, this.onAskText, this);
    bus.suscribe(MessageType.Cancel, this.onCancel, this);
  }
  /** On cancel received. */  
  onCancel() {
    if (this.$.overlay.opened)
      this.$.overlay.close();
  }
  onAskText(data) {
    this.description = data;
    this.value = '';
    this.open();
  }
  committedChanged(oldV, newV) {
    if (newV === "") return;
    this.wasCanceled = false;
    this.$.overlay.close();
  }
  /** Main closing exit point. */
  onOverlayClosed() {
    this.close();
  }
  getResults() {
    return {
      description: this.description,
      value: this.value
    };
  }

  reset() {
    this.description = '';
    this.value = '';
    this.wasCanceled = true;
  }
  open() {
    this.$.overlay.open();
  }
  close() {
    bus.publish(MessageType.AnswerText, this.wasCanceled ? null : this.getResults());
    this.reset();
  }
}  

Polymer(AppText.prototype);