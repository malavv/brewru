/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/es6-promise/es6-promise.d.ts" />

/// <reference path="wizardStep.ts" />

class AddIngredientFactory implements IStepFactory {
  private state:number = 0;

  data:{ [key: string]: any; } = {};

  next() : WizardConfig {
    switch (this.state) {
      case 0: // Get Name
        this.state = 1;
        return new WizardConfig('name', WizardStep.text, { description: 'Ingredient Step Name'} );
      case 1:
        this.state = 2;
         return new WizardConfig('menu', WizardStep.menu, Supply.allIngredientTypes());
      case 2:
        this.state = 3;
        return new WizardConfig('ingredient', WizardStep.ingredient, Supply.IngType[this.data['menu']]);
      case 3:
        this.state = 4;
        return new WizardConfig('qty', WizardStep.quantity, {
          description: 'How Much :',
          allowed: this.data['ingredient'].dimensions()
        });
      default:
        return undefined;
    }
  }

  build() : Step[] {
    return [new Step(this.data['name'], StepType.addIngredient)];
  }

  isComplete() : boolean {
    return this.data['name'] !== undefined && this.data['qty'] !== undefined;
  }
}