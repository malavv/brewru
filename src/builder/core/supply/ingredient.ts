/// <reference path="../base/conceptRef.ts" />
/// <reference path="../units/dimension.ts" />

module Supply {

  export enum Type {
    Dynamic,
    Fermentable,
    Hops,
    Miscellaneous,
    Water,
    Yeast
  }
  export function allIngredientTypes() : Array<Type> {
    return [
        Type.Dynamic,
        Type.Fermentable,
        Type.Hops,
        Type.Miscellaneous,
        Type.Water,
        Type.Yeast
    ];
  }

	export class Ing {
		private dimension: Dim;
		private ref: ConceptRef;
		private type: Type;
		
		constructor(concept: ConceptRef, type: Type, dimensions: Dim) {
			this.ref = concept;
			this.type = type;
			this.dimension = dimensions;
		}

    public getRef() : ConceptRef { return this.ref; }
		public getType() : Type { return this.type; }
		public getDimension() : Dim { return this.dimension; }

		public toString() : string { return this.ref.name; }
	}
}