/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/base/codes.ts" />

var Polymer:Function = Polymer || function () {}

/**
 * Enables Pop-Up selection from a list of items.
 *
 *  Two selection interfaces are available.
 *    - Select by pressing the index of the item.
 *    - Clicking on the item.
 *  Can be canceled using the 'cancel' bus event.
 *  Result:
 *    On closing the menu without a selection, it will send a bus event
 *    with a null item.
 */
class AppMenu {
  items:Array<Object> = [];
  selection:Object = undefined;
  hidden:boolean;
  $:any;
  
  ready() {
    bus.suscribe(MessageType.AskMenu, this.onAskMenu, this);
    bus.suscribe(MessageType.Cancel, this.onCancel, this);
    this.hidden = true;
  }
  /** On request made. */
  onAskMenu(data:Array<Object>) {
    console.log('AppMenu', data)
    this.items = data;
    this.open();
  }
  /** On cancel received. */
  onCancel() {
    if (this.$.overlay.opened)
      this.$.overlay.close();
  }
  
  /** Main closing exit point. */
  onOverlayClosed() {
    this.close();
  }
  
  selectionChanged(oldVal:Object, newVal:Object) {
    if (newVal === undefined) return;
    this.$.overlay.close();
  }

  close() {
    this.$.list.looseFocus();
    this.hidden = true;
    this.items = [];
    bus.publish(MessageType.AnswerMenu, this.selection);
  }
  
  open() {
    this.$.list.grabFocus();
    this.hidden = false;
    this.$.overlay.open();
  }
}  

Polymer(AppMenu.prototype);