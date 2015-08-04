/// <reference path="reactor.ts" />
/// <reference path="base/conceptRef.ts" />
/// <reference path="supply/ingredient" />

class Ingredients {
	inventory: Array<Supply.Ing> = [];
	reactors: Array<Reactor> = [];
	
	listAllIngredients() {
		return [].concat(this.inventory);
	}
	
	getFromInventory(concept: ConceptRef) {
		return this.inventory.filter((i) => { return i.ref === concept; });
	}
	
	addToInventory(ingredient: Supply.Ing) {
		this.inventory.push(ingredient);
	}
	addSrc(reactor: Reactor) {
		if (this.reactors.some((s) => { return s.id == reactor.id; }))
		  return;
		this.reactors.push(reactor);
	}
}