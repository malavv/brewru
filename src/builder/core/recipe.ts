/// <reference path="reactor.ts" />
/// <reference path="supply/ingredient.ts" />
/// <reference path="entities.ts" />

class Recipe {
  public name: string;
  public description: string;
  public style: Style;
  reactors: Array<Reactor>;
	
  constructor(name: string = 'Anonymous', reactors: Array<Reactor> = [Reactor.createAnon()]) {
    this.name = name;
    this.description = '';
    this.reactors = reactors;
  }
	
  addReactor(reactor:Reactor) {
    if (!Reactor.isReactor(reactor)) {
      console.log("[Recipe] Object added is not a reactor");
      return;
    }
    this.reactors.push(reactor);
  }
  
  listDynamicIngredients() : Supply.Ing[] {
	  return [
      new Supply.Ing(Entities.tapWater, null, [Dim.Volume]) 
    ].concat(this.reactors.reduce(this._getOutput.bind(this), []));
  }
  
  private _getOutput(last: Object[], elem: Reactor) {
    return last.concat(elem.steps.filter(s => s.type === StepType.defineOutput));
  }
  
  public encode() : Object {
    return JSON.stringify(this);
  }
  
  public static decode(o : {[key: string]: any}) {
    var name = o['name'];
    var reactors = o['reactors'].map(Recipe._decodeReactor);
    return new Recipe(name, reactors);
  }
  
  private static _decodeReactor(o : {[key: string]: any}) : Reactor {
    return new Reactor(
      <number>(o['id']),
      <string>(o['name']),
      <Array<Step>>(o['steps'].map(Recipe._decodeStep))
    );
  }
  private static _decodeStep(o : {[key: string]: any}) : Step {
    return new Step(
      <string>(o['name']),
      <ConceptRef>(o['type']),
      <string>(o['id'])
    );
  }
  private static _decodeRef(o : {[key: string]: any}) : ConceptRef {
    return new OntoRef(
      <string>(o['ref']),
      <string>(o['name'])
    );
  }
}