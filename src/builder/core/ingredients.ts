/// <reference path="reactor.ts" />
/// <reference path="base/conceptRef.ts" />
/// <reference path="supply/ingredient" />

class Ingredients {
	inventory: Array<Supply.Ing> = [];
	reactors: Array<Reactor> = [];
	
	listAllIngredients() {
		return [].concat(this.inventory);
	}
	
	getFromInventory(ref: ConceptRef) {
		return this.inventory.filter((ing) => ing.getRef() === ref);
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