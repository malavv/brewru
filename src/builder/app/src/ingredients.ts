/// <reference path="ingredient.ts" />
/// <reference path="reactor.ts" />
/// <reference path="base/conceptRef.ts" />

class Ingredients {
	inventory: Array<Ingredient> = [];
	reactors: Array<Reactor> = [];
	
	listAllIngredients() {
		return [].concat(this.inventory).concat(this.reactors.map((r) => { return r.src; }));
	}
	getFromInventory(concept: ConceptRef) {
		return this.inventory.filter((i) => { return i.concept === concept; });
	}
	
	addToInventory(ingredient: Ingredient) {
		this.inventory.push(ingredient);
	}
	addSrc(reactor: Reactor) {
		if (this.reactors.some((s) => { return s.id == reactor.id; }))
		  return;
		this.reactors.push(reactor);
	}
}