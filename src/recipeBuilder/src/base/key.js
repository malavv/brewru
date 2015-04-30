define(
	[],
	function() {

  function code2char(code) {
    switch(code) {
      case 13: return 'enter';
      case 27: return 'esc';
      default: return 'unknown';
    }
  }

  function keyToBinding(keyEvent) {
    var keyBinding = [];
    if (keyEvent.altKey) keyBinding.push('alt');
    if (keyEvent.ctrlKey) keyBinding.push('ctrl');
    if (keyEvent.shiftKey) keyBinding.push('shift');

    var str = String.fromCharCode(event.keyCode || event.which);
    keyBinding.push(str.match(/\w/) ? str : code2char(str.charCodeAt(0)));
    return keyBinding.join('+');
  }

  function Key(event) {
    this.event = event;
  }

  Key.fromEvent = function(event) {
    return new Key(event);
  };

  Key.prototype.toString = function() {
    return keyToBinding(this.event);
  };

  return Key;
});