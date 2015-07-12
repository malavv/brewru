/// <reference path="base/conceptRef.ts" />

/**
 * This will need to be reviewed with specific sub-classes.
 */
class Step {
	id: string;
	name: string;
	type: ConceptRef
	
	constructor(name: string, type: ConceptRef) {
		this.id = 'anon:0';
		this.name = name;
		this.type = type;
	}
	
	toString() : string {
		//return _.template('{{constructor.name}}<{{reactor.use}}>[{{inputs.length}}->{{name}}({{id}})->{{outputs.length}}]')(this);
		return this.name;
	}
}

/**
 * Step type object for easy autocomplete.
 * 
 * Should be filled from the ontology and should be used using the Step object.
 */
class StepType {
	static addIngredient: ConceptRef = OntoRef.createAnon('Add Ingredient');
	static defineOutput: ConceptRef = OntoRef.createAnon('Define Output');
	static ferment: ConceptRef = OntoRef.createAnon('Ferment');
	static heating: ConceptRef = OntoRef.createAnon('Heating');
	static merging: ConceptRef = OntoRef.createAnon('Mergin');
	static splitting: ConceptRef = OntoRef.createAnon('Splitting');
	
	// Should not be in all, since sentinel step.
	static start: ConceptRef = OntoRef.createAnon('Start'); 
	
	static All : Array<ConceptRef> = [
			StepType.addIngredient,
			StepType.defineOutput,
			StepType.ferment,
			StepType.heating,
			StepType.merging,
			StepType.splitting
	];
}