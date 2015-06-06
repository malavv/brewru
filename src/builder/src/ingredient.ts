/// <reference path="base/conceptRef.ts" />
/// <reference path="base/quantity.ts" />

class Ingredient {
	concept: ConceptRef;
	quantity: Quantity;
	
	constructor(concept: ConceptRef, quantity: Quantity) {
		this.concept = concept;
		this.quantity = quantity;
	}
	
	toString() {
		return this.concept.id + this.quantity;
	}
}