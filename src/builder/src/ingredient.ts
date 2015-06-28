/// <reference path="base/conceptRef.ts" />

enum IngredientType {
	Fermentables,
	Hops,
	Yeasts,
	Miscellaneous,
	Dynamic
}

class Ingredient {
	concept: ConceptRef;
	type: IngredientType;

	constructor(concept: ConceptRef, type: IngredientType) {
		this.concept = concept;
		this.type = type;
	}

	toString() {
		return this.concept.name;
	}
}