/// <reference path="reactor.ts" />

class Recipe {
	name: string;
	reactors: Array<Reactor>
	
	constructor(name: string = 'Anonymous', reactors: Array<Reactor> = []) {
		this.addReactor(Reactor.createAnon());
	}
	
	addReactor(reactor:Reactor) {
		if (!Reactor.isReactor(reactor)) {
      		console.log("[Recipe] Object added is not a reactor");
      		return;
    	}
    	this.reactors.push(reactor);
	}
}