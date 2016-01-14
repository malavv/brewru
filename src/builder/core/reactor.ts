/// <reference path="ingredientSrc.ts" />
/// <reference path="step.ts" />

class Reactor {
	private static nextIdx:number = 0;
	
	public id: number;
	public name: string;
	public steps: Array<Step>;
	
	constructor(id: number = 0, name: string = 'Anonymous', steps: Array<Step> = [new Step('start', StepType.start)]) {
		this.id = id;
		this.name = name;
		this.steps = steps;
	}
	
	public addAfter(lhs: any, newObj: any) {
		if (newObj.timing === 'After') {
      		var idx = this.steps.indexOf(lhs);
      		this.steps.splice(idx + 1, 0, new Step('Anonymous', null));
    	}
	}
	
	public static createAnon() {
		return new Reactor(Reactor.nextIdx);
	}
	public static isReactor(reactor: Reactor) {
		return reactor.id !== undefined 
			&& reactor.steps !== undefined 
			&& Array.isArray(reactor.steps);
	}
	private static nextId() {
		return 'reactor:' + Reactor.nextIdx++;
	}
}