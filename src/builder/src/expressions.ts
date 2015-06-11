/// <reference path="base/codes.ts" />

var PolymerExpressions = PolymerExpressions || {}; 

PolymerExpressions.prototype.toSingleCharIdx = function(input) {
  var codes = new Codes();
  return codes.int2base(input);
}