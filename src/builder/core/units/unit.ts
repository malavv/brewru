/// <reference path="../base/conceptRef.ts" />
/// <reference path="dimension.ts" />

class Unit {
	concept: ConceptRef;
	symbol:string;
	offset:number;
	multiplier:number;
	dimension: Dim;
	systemRef: string; /* Only its id to prevent circular reference. */

	constructor(concept:ConceptRef, symbol:string, offset:number, multiplier:number, dim:Dim, system:string) {
		this.concept = concept;
		this.symbol = symbol;
		this.offset = offset;
		this.multiplier = multiplier;
		this.dimension = dim;
		this.systemRef = system;
	}
	
	public toString() : string {
		return this.concept + '(' + this.symbol + ')';
	}

  public toJSON() : string {
    return this.concept.ref;
  }

	public static Unknown = new Unit(OntoRef.createAnon('unknownUnit'), '', 0, 0, undefined, undefined);
}