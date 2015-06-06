/// <reference path="dimension.ts" />
/// <reference path="unit.ts" />
/// <reference path="../base/conceptRef.ts" />

class System {
	mass: { [mass: string]: Unit; };
	length: { [length: string]: Unit; };
	volume: { [volume: string]: Unit; };
	
	constructor(config:{
			mass: { [mass: string]: Unit; };
			length: { [mass: string]: Unit; };
			volume: { [mass: string]: Unit; }
		} = {mass:{}, length:{}, volume:{}}) {
		this.mass = config.mass;
		this.length = config.length;
		this.volume = config.volume;
		this.setSystem(this.mass);
		this.setSystem(this.length);
		this.setSystem(this.volume);
	}
	
	setSystem(units: { [s: string]: Unit; }) {
		Object.getOwnPropertyNames(units).forEach((p) => {
			units[p].setSystem(this);
		});
	}
	
	static SI: System = new System({
		mass: {
			kg: new Unit(new OntoRef('brew:liter', 'liter'), 'kg', 0, 1, Dimension.Mass)
		},		
		length: {},
		volume: {}
	});
	static UsCust: System = new System();
	static Imperial: System = new System();
}