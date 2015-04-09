define(
	[],
	function() {

  var
    steps = [
      {name:'Add Ingredient'}
    ];


  function NewStep() {
    window.bus.register(this, this.popupAnswer, 'popup-answer');
  }

  NewStep.prototype.popupAnswer = function(data) {
    console.log('popupAnswer', data);
  };

  NewStep.prototype.triggered = function() {
    var min = 48, max = 48 + steps.length;
    window.addEventListener('keyup', function(evt) {
      if (evt.keyCode < min || evt.keyCode > max) return;
      console.log('found! ', evt.keyCode - 48)
      window.bus.broadcast('cancelDialog',  null);
    }, true);
    window.bus.broadcast('selectionDialog',  steps);
  };

  return NewStep;
});

// 48