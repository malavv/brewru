/// <reference path="../../src/base.ts" />

class AppTest {
  name: string;

  created() {
    this.name = "app-test";
  }

  ready() {
    this.welcome();
    var hw = new HelloWorld();
    hw.welcome();
  }

  private welcome() {
    console.log('[app-test] Welcome!', this.name, this);
  }
}

Polymer(AppTest.prototype);