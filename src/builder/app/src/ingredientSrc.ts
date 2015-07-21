/// <reference path="base/conceptRef.ts" />
/// <reference path="ingredient.ts" />

class IngredientSrc {
	concept: ConceptRef;
	stocks: Array<Ingredient>;
	
	constructor(concept: ConceptRef) {
		this.concept = concept;
		this.stocks = [];
	}
	
	addAll(items:Array<Ingredient>) {
		this.stocks = this.stocks.concat(items);
		return this;
	}
}