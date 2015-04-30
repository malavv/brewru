define(
	[],
	function() {

	var idx = 0;

  function Concept(id, name) {
  	this.id = id || '<invalid>';
  	this.name = name || 'N/A';
  }

  Concept.createAnon = function(name) {
    return new Concept('anon:' + idx++, name);
  };

  Concept.prototype.toString = function() {
    return this.name;
  };

  return Concept;
});