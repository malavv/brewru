/// <reference path="base/conceptRef.ts" />
/// <reference path="supply/ingredient.ts" />

class IngredientSrc {
	concept: ConceptRef;
	stocks: Array<Supply.Ing>;
	
	constructor(concept : ConceptRef) {
		this.concept = concept;
		this.stocks = [];
	}
	
	addAll(items : Array<Supply.Ing>) {
		this.stocks = this.stocks.concat(items);
		return this;
	}
}