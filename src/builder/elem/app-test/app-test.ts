/// <reference path="../../src/base.ts" />
/// <reference path="../../src/base/eventBus.ts" />
/// <reference path="../../src/base/messageType.ts" />
/// <reference path="../../src/base/keyboard.ts" />

var Polymer:Function = Polymer || function () {}

class AppTest {
  name: string;
  bus: EventBus = new EventBus();

  ready() {
    this.bus = new EventBus();
    this.bus.suscribe(
      MessageType.unknown,
      this.onUnknown,
      this
    );
    this.bus.publish(MessageType.unknown, 'No Data');
    this.welcome();
  }
  
  onUnknown() {
    console.log('[app-test] onUnknown');
  }

  private welcome() {
    console.log('[app-test] Welcome!', this.name, this);
  }
}

Polymer(AppTest.prototype);