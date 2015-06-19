/// <reference path="../../../src/base/codes.ts" />

var Polymer:Function = Polymer || function () {}

class WidgetDemo {
  selected: number;
  exampleText: string;
  
  exampleList: Array<{name:String;}>;
  exampleSelection: any;
  ready() {
    this.selected = 0;
    this.exampleText = "Lorem Ipsum";
    this.exampleList = [
      {name: "0", toString: function() {return this.name;}},
      {name: "1", toString: function() {return this.name;}},
      {name: "2", toString: function() {return this.name;}}
    ];
  }
}

Polymer(WidgetDemo.prototype);
