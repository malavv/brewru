/// <reference path="../units/unit.ts" />

class Quantity {
	magnitude: number;
	unit: Unit;
	
	constructor(magnitude: number, unit: Unit) {
		this.magnitude = magnitude;
		this.unit = unit;	
	}
	
	toString() : string {
		return this.magnitude + ' ' + this.unit.symbol;
	}
}