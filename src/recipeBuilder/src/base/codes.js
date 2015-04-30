define([], function() {
  'use strict';

  var
    codes = '0123456789abcdefghijklmnopqrstuvwxyz',
    max = codes.length,
    errorCode = '-',
    errorIdx = -1;

  /**
   * Utility to convert indexes to codes.
   *
   * Mainly used to keep items indexes single char.
   */
  function Codes() {}

  Codes.i2c = function(i) {
    if (isNaN(i) || i < 0 || i >= max)
      return errorCode;
    return codes[i];
  };

  Codes.c2i = function(c) {
    if (typeof(c) !== "string")
      return errorIdx;
    return codes.indexOf(c[0]);
  };

  return Codes;
});