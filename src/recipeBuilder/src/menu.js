define(
  [
    'base/bus'
  ],
  function(bus) {

  var
    instance = new Menu();

  function Menu() {}

  Menu.prototype.onAnswerMenu = function(answer) {
    console.log('Menu', 'onAnswer', answer);
  };

  function ask(list) {
    return new Promise(function(resolve, reject) {
      var tmp = {
        onAnswerMenu: function(data) {
          resolve(data);
        }
      };
      window.bus.broadcast('AskMenu', list);
      window.bus.register(tmp, 'AnswerMenu');
    });
  }

  return {
    ask: ask
  };
});