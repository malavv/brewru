/// <reference path="../base/conceptRef.ts" />
/// <reference path="dimension.ts" />
/// <reference path="system.ts" />

class Unit {
	concept: ConceptRef;
	symbol:string;
	offset:number;
	multiplier:number;
	dimension: Dimension;
	system: System;
	
	//'brew:litre', 'kg', 0, 1, Dimension.Mass
	constructor(concept:ConceptRef, symbol:string, offset:number, multiplier:number, dim:Dimension) {
		this.concept = concept;
		this.symbol = symbol;
		this.offset = offset;
		this.multiplier = multiplier;
		this.dimension = dim;
	}
	
	setSystem(system:System) {
		this.system = system;
	}
}