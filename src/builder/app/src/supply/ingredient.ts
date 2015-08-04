/// <reference path="../base/conceptRef.ts" />
/// <reference path="../units/dimension.ts" />

module Supply {
	export class IngType {
		public static Fermentable = new IngType('fermentable');
		public static Hops = new IngType('hops');
		public static Yeast = new IngType('yeast');
		public static Miscellaneous  = new IngType('miscellaneous');
		public static Dynamic = new IngType('dynamic');
		public static all() {
			return [
				IngType.Fermentable,
				IngType.Hops,
				IngType.Yeast,
				IngType.Miscellaneous,
				IngType.Dynamic
			];
		}
		
		public name: string;
		
		constructor(name : string) {
			this.name = name;
		}
		
		public static of(name: string) : IngType {
			var found = IngType.all().filter(t => t.name === name);
			return found.length === 1 ? found[0] : null;
		}
		
		public toString() : string {
			return this.name;
		}
	}
	
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