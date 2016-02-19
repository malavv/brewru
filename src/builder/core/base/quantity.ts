/// <reference path="../units/unit.ts" />

class Quantity {
	private magnitude: number;
	private unit: Unit;
	
	constructor(magnitude: number, unit: Unit) {
		this.magnitude = magnitude;
		this.unit = unit;	
	}

	public static bySym(magnitude: number, unitSymbol: string) : Quantity {
    return new Quantity(magnitude, SI.sym(unitSymbol));
	}
	
	toString() : string {
		return this.magnitude + ' ' + this.unit.symbol;
	}
}