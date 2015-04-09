define(
	[
    'base/bus',
    'base/key'
  ],
	function(Bus, Key) {

  function Sequence(sequence, evt) {
    this.evt = evt;
    this.sequence = sequence;
    this.buffer = [];
    sequence.forEach(function() { this.buffer.push(null); }, this);
  }

  Sequence.prototype.update = function(evt) {
    this.buffer.unshift(evt);
    this.buffer.pop();
  };
  Sequence.prototype.isTriggered = function() {
    return this.sequence.every(function(elem, i) {
      return this.buffer[i] instanceof KeyboardEvent && elem.isEvent(this.buffer[i]);
    }, this);
  };


  function Shortcuts() {
    this.sequences = [];
    window.addEventListener('keyup', this.check.bind(this), true);
  }

  Shortcuts.prototype.add = function(sequence, type) {
    this.sequences.push(new Sequence(sequence, type));
  };

  Shortcuts.prototype.check = function(evt) {
    this.sequences.forEach(function(seq) {
      seq.update(evt);
      if (seq.isTriggered()) {
        window.bus.broadcast(seq.evt, null);
      }
    });
    //console.log('Event Key', evt.altKey, evt.charCode, evt.ctrlKey, evt);
  };

  return Shortcuts;
});