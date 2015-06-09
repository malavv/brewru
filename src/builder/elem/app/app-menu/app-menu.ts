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
  busRequest = 'AskMenu';
  busCancel = 'Cancel';
  busResult = 'AnswerMenu';
  items = [];
  selection = undefined;
  hidden:boolean;
  $:any;
  
  ready() {
    bus.suscribe(MessageType.AskMenu, this.onAskMenu, this);
    bus.suscribe(MessageType.Cancel, this.onCancel, this);
    this.hidden = true;
  }
  /** On request made. */
  onAskMenu(data) {
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

  handleEvent(event:KeyboardEvent) {
    var codes = new Codes();
    var idx = codes.base2int(String.fromCharCode(event.which));
    if (idx < 0 || idx >= this.items.length) return;
    this.$.list.selectItem(idx);
  }
  selectionChanged(o, n) {
    if (n === undefined) return;
    this.$.overlay.close();
  }

  close() {
    this.hidden = true;
    this.items = [];
    window.removeEventListener('keypress', this, false);
    bus.publish(MessageType.AnswerMenu, this.selection);
  }
  
  open() {
    this.hidden = false;
    window.addEventListener('keypress', this, false);
    this.$.overlay.open();
  }
}  

Polymer(AppMenu.prototype);