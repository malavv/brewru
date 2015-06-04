/// <reference path="../../src/base.ts" />
/// <reference path="../../src/base/eventBus.ts" />
/// <reference path="../../src/base/messageType.ts" />

var Polymer = Polymer || {}

class AppTest {
  name: string;
  bus: EventBus = new EventBus();

  ready() {
    this.bus = new EventBus();
    
    this.bus.suscribe(this, [MessageType.unknown]);
    this.bus.publish(MessageType.unknown, 'No Data');
    this.welcome();
    var hw = new HelloWorld();
    hw.welcome();
  }
  
  onUnknown() {
    console.log('[app-test] onUnknown');
  }

  private welcome() {
    console.log('[app-test] Welcome!', this.name, this);
  }
}

Polymer(AppTest.prototype);