define(
	[],
	function() {

  function Key(details) {
    this.alt = details.alt;
    this.ctrl = details.ctrl;
    this.code = details.code;
  }

  Key.prototype.isEvent = function(evt) {
    if (!(evt instanceof KeyboardEvent)) {
      console.error('! valid keyboard event to compare');
      return;
    }
    return evt.altKey === this.alt &&
      evt.ctrlKey === this.ctrl &&
      evt.keyCode === this.code;
  };

  Key.alt = {
    s: new Key({alt: true, ctrl: false, code: 83})
  };
  Key.none = new Key({alt: false, ctrl: false, code: -1});

  return Key;
});