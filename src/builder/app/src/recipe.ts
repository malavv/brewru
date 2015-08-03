/// <reference path="reactor.ts" />
/// <reference path="ingredient.ts" />
/// <reference path="entities.ts" />

class Recipe {
  name: string;
  reactors: Array<Reactor> = []
	
  constructor(name: string = 'Anonymous', reactors: Array<Reactor> = []) {
    this.name = name;
    this.addReactor(Reactor.createAnon());
  }
	
  addReactor(reactor:Reactor) {
    if (!Reactor.isReactor(reactor)) {
      console.log("[Recipe] Object added is not a reactor");
      return;
    }
    this.reactors.push(reactor);
  }
  
  listDynamicIngredients() : Ingredient[] {
	  return [
      new Ingredient(Entities.tapWater, null, [Dim.Volume]) 
    ].concat(this.reactors.reduce(this._getOutput.bind(this), []));
  }
  
  private _getOutput(last: Object[], elem: Reactor) {
    return last.concat(elem.steps.filter(s => s.type === StepType.defineOutput));
  }
}