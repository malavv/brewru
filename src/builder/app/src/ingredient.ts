/// <reference path="base/conceptRef.ts" />

/// <reference path="units/dimension.ts" />

enum IngredientType {
	Fermentables,
	Hops,
	Yeasts,
	Miscellaneous,
	Dynamic
}

class Ingredient {
	public concept: ConceptRef;
	public type: IngredientType;
	public dimensions: Array<Dim>;

	constructor(concept: ConceptRef, type: IngredientType, dimensions: Array<Dim> = []) {
		this.concept = concept;
		this.type = type;
		this.dimensions = dimensions;
	}

	public toString() {
		return this.concept.name;
	}
}