/// <reference path="ingredientSrc.ts" />
/// <reference path="step.ts" />

class Reactor {
	static nextIdx:number = 0;
	id: number;
	src: IngredientSrc;
	steps: Array<Step> = [];
	
	constructor(id: number = 0) {
		this.id = id;
		this.steps.push(new Step('start', 'start'));
	}
	
	addAfter(lhs: any, newObj: any) {
		if (newObj.timing === 'After') {
      		var idx = this.steps.indexOf(lhs);
      		this.steps.splice(idx + 1, 0, new Step('Anonymous', null));
    	}
	}
	
	static createAnon() {
		return new Reactor(Reactor.nextIdx);
	}
	static isReactor(reactor: Reactor) {
		return reactor.id !== undefined 
			&& reactor.steps !== undefined 
			&& Array.isArray(reactor.steps);
	}
	private static nextId() {
		return 'reactor:' + Reactor.nextIdx++;
	}
}