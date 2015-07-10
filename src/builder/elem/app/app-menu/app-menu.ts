/// <reference path="../../../src/base/polymer.d.ts" />
/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/base/codes.ts" />
/// <reference path="../../../src/errors.ts" />

class AppMenuWrapper {
  val: string;
  toString() : string { return this.val; }
  constructor(val:string) { this.val = val; }
}

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
  is:string = 'app-menu';
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
    bus.publish(MessageType.AnswerMenu, AppMenu.unwrap(this.selection));
  }

  open() {
    this.$.list.grabFocus();
    this.hidden = false;
    this.$.overlay.open();
  }
  
  private static unwrap(data: Object) : Object {
    return data instanceof AppMenuWrapper ? data.val : data;
  }
}