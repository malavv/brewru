/// <reference path="../base/conceptRef.ts" />
/// <reference path="../units/dimension.ts" />

module Supply {

  export enum IngType {
    Dynamic,
    Fermentable,
    Hops,
    Miscellaneous,
    Water,
    Yeast
  }
  export function allIngredientTypes() : Array<IngType> {
    return [
        IngType.Dynamic,
        IngType.Fermentable,
        IngType.Hops,
        IngType.Miscellaneous,
        IngType.Water,
        IngType.Yeast
    ];
  }


	//export class IngType {
  //
	//	public static of(name: string) : IngType {
	//		var found = IngType.all().filter(t => t.name === name);
	//		return found.length === 1 ? found[0] : null;
	//	}
  //
	//}
	
	/**
	 * Represents the abstract concept of certain ingredient.
	 * 
	 * For example, Hallertauer is a base ingredient but Hallertauer (us)
	 * from a certain place and having a certain AA is a Ingredient.
	 */
	export class BaseIng {
		private _type: IngType;
		private _dimensions: Array<Dim>;
		
		public ref: ConceptRef;
		
		constructor(concept: ConceptRef, type: IngType, dimensions: Array<Dim> = []) {
			this.ref = concept;
			this._type = type;
			this._dimensions = dimensions;
		}
		
		public type() : IngType { return this._type; }
		public dimensions() : Array<Dim> { return this._dimensions; }
		public toString() : string { return this.ref.name; }
		public toJSON() : Object {
			return {
				ref: this.ref.ref,
				type: this._type
			}
		}
	}
	
	/**
	 * Represent an ingredient but not its associated supplies.
	 */
	export class Ing extends BaseIng {
		constructor(concept: ConceptRef, type: IngType, dimensions: Array<Dim> = []) {
			super(concept, type, dimensions);
		}
		public toString() : string { return this.ref.name; }
	}	
}