/// <reference path="../../../src/defs/es6-promise/es6-promise.d.ts" />
/// <reference path="../../../src/ingredient.ts" />
/// <reference path="wizardStep.ts" />
/// <reference path="../../../src/step.ts" />

class AddIngredientFactory implements IStepFactory {
  private static ingredientTypes: Array<string> = ["dynamic", "fermentables", "hops", "yeast", "miscellaneous"];

  private state:number = 0;

  data:{ [key: string]: any; } = {};

  next() : WizardConfig {
    switch (this.state) {
      case 0: // Get Name
        this.state = 1;
        return new WizardConfig('name', WizardStep.text, { description: 'Ingredient Step Name'} );
      case 1:
        this.state = 2;
        return new WizardConfig('menu', WizardStep.menu, AddIngredientFactory.ingredientTypes);
      case 2:
        this.state = 3;
        return new WizardConfig('ingredient', WizardStep.ingredient, this.name2type(this.data['menu']));
      case 3:
        this.state = 4;
        return new WizardConfig('qty', WizardStep.quantity, {
          description: 'How Much :',
          allowed: this.data['ingredient'].dimensions
        });
      default:
        return undefined;
    }
  }

  name2type(name : string) : IngredientType {
    switch (this.data['menu']) {
      case 'dynamic': return IngredientType.Dynamic;
      case 'fermentables': return IngredientType.Fermentables;
      case 'hops': return IngredientType.Hops;
      case 'yeast': return IngredientType.Yeasts;
      case 'miscellaneous': return IngredientType.Miscellaneous;
    }
  }

  build() : Step[] {
    return [new Step(this.data['name'], StepType.addIngredient)];
  }

  isComplete() : boolean {
    return this.data['name'] !== undefined && this.data['qty'] !== undefined;
  }
}