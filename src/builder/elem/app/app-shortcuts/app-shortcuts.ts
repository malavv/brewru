/// <reference path="../../../src/shortcuts.ts" />
/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/base/Keyboard.ts" />
/// <reference path="../../../src/base/messageType.ts" />

class AppShortcuts {
  public is:string = 'app-shortcuts';
  public opened:boolean = false;
  
  public behaviors:any = [
    Polymer.IronOverlayBehavior
  ];

  public static shortcuts:Shortcuts = new Shortcuts()
      .add('alt+S', MessageType.CreateStep, 'Create new step')
      .add('shift+6', MessageType.ShowShortcuts, 'Toggle Visibility of Shortcuts')
      .add('esc', MessageType.Cancel, 'Cancel current action.');

  private listed:Shortcuts;
  private $:any;

  ready() {
    window.addEventListener('keyup', (e:KeyboardEvent) => {
      this.onKeyUp(e);
    }, false);
    this.listed = AppShortcuts.shortcuts;
    bus.suscribe(MessageType.ShowShortcuts, this.onShowShortcuts, this);
  }

  /** Only need to show when requested. Is closed automatically by core-overlay. */
  private onShowShortcuts() {
    this.opened = true;
  }

  /**
   * On all key in the application (Using key-up to also get none aphabetic keys.)
   * @param event Keyboard event of the pressed key.
   */
  private onKeyUp(event:KeyboardEvent) {
    var key = Keyboard.fromEvt(event);

    if (!this.listed.hasKey(key)) return;
    bus.publish(this.listed.get(key).intent);
  }
}