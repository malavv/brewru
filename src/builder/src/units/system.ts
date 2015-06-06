/// <reference path="dimension.ts" />
/// <reference path="unit.ts" />
/// <reference path="../base/conceptRef.ts" />

class SI {
	static Mass = {
		kg: new Unit(new OntoRef('brew:kg', 'kilogram'), 'kg', 0, 1, Dimension.Mass, System.SI)
	};
	static Length = {
	};
	static Volume = {
		liter: new Unit(new OntoRef('brew:liter', 'liter'), 'l', 0, 1, Dimension.Volume, System.SI)
	};
}
class UsCust {
	static Mass = {
	};
	static Length = {
	};
	static Volume = {
	};
}
class Imperial {
	static Mass = {
	};
	static Length = {
	};
	static Volume = {
	};
}

enum System {
	SI,
	UsCust,
	Imperial
}