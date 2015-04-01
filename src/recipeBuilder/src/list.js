define(function() {

  function Node(data) {
    this.data = data;
    this.next = null;
    this.last = null;
  }

  function List() {
  	this.begin = null;
    this.end = null;
  }

  List.prototype.push = function(data) {
    var newNode = new Node(data);
    if (this.end === null) {
      this.begin = newNode;
      this.end = newNode;
      return this;
    }
    this.end.next = newNode;
    newNode.last = this.end;
    this.end = newNode;
  };

  return List;
});