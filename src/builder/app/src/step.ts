/// <reference path="base/conceptRef.ts" />

/** This will need to be reviewed with specific sub-classes. */
class Step {

	private static idx = 0;

	public id: string;
	public name: string;
	public type: ConceptRef

	constructor(name: string, type: ConceptRef, id: string = 'anon:' + Step.idx++) {
		this.id = id;
		this.name = name;
		this.type = type;
	}

	public toString() : string {
		return this.name;
	}
}

/**
 * Step type object for easy autocomplete.
 *
 * Should be filled from the ontology and should be used using the Step object.
 */
class StepType {
	public static addIngredient: ConceptRef = OntoRef.createAnon('Add Ingredient');
	public static defineOutput: ConceptRef = OntoRef.createAnon('Define Output');
	public static ferment: ConceptRef = OntoRef.createAnon('Ferment');
	public static heating: ConceptRef = OntoRef.createAnon('Change of Temp.');
	public static merging: ConceptRef = OntoRef.createAnon('Merging');
	public static splitting: ConceptRef = OntoRef.createAnon('Splitting');

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