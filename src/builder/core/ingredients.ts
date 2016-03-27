/// <reference path="knowledge/domain/substance.ts" />

class Ingredients {
	private inventory: Array<Substance> = [];

	listAllIngredients() {
		return [].concat(this.inventory);
	}

	getFromInventory(ref: string) {
		return this.inventory.filter((ing) => ing.iri === ref);
	}

	addToInventory(ingredient: Substance) {
		this.inventory.push(ingredient);
	}
}
