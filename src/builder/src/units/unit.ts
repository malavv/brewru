/// <reference path="../base/conceptRef.ts" />
/// <reference path="dimension.ts" />

class Unit {
	concept: ConceptRef;
	symbol:string;
	offset:number;
	multiplier:number;
	dimension: Dim;
	system: System;

	constructor(concept:ConceptRef, symbol:string, offset:number, multiplier:number, dim:Dim, system:System) {
		this.concept = concept;
		this.symbol = symbol;
		this.offset = offset;
		this.multiplier = multiplier;
		this.dimension = dim;
		this.system = system;
	}
	
	toString() : string {
		return this.concept + '(' + this.symbol + ')';
	}

	public static Unknown = new Unit(OntoRef.createAnon('unknownUnit'), '', 0, 0, undefined, undefined);
}