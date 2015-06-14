/// <reference path="base/codes.ts" />

var PolymerExpressions:Function = PolymerExpressions || function() {}; 

PolymerExpressions.prototype.toSingleCharIdx = function(input:number) : string {
  var codes = new Codes();
  return codes.int2base(input);
}