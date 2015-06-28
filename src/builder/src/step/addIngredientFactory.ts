/// <reference path="wizard.ts" />
/// <reference path="stepFactory.ts" />
/// <reference path="../step.ts" />

/// <reference path="../../elem/app/app-ingredient/app-ingredient.ts" />
/// <reference path="../../elem/app/app-text/app-text.ts" />

class AddIngredientFactory implements IStepFactory {
  private state:number = 0;

  data: { [key: string]: any; } = {};

  next(): WizardConfig {
    switch(this.state) {
      case 0: // Get Name
        this.state = 1;
        return new WizardConfig('name', AppText.ask, { description: 'Ingredient Step Name' });
      case 1:
        this.state = 2;
        return new WizardConfig('menu', AppMenu.ask, ["dynamic", "fermentables", "hops", "yeast", "miscellaneous"]);
      case 2:
        this.state = 3;
        return new WizardConfig('qty', AppIngredient.ask, this.name2type(this.data['menu']));
      default: 
        return undefined;
    }
  }
  
  name2type(name: string) : IngredientType {
    switch (this.data['menu']) {
      case 'dynamic': return IngredientType.Dynamic;
      case 'fermentables': return IngredientType.Fermentables;
      case 'hops': return IngredientType.Hops;
      case 'yeast': return IngredientType.Yeasts;
      case 'miscellaneous': return IngredientType.Miscellaneous;
    }
  }

  build(): Step[] {
    return [new Step(this.data['name'], StepType.addIngredient)];
  }

  isComplete(): boolean {
    return this.data['name'] !== undefined && this.data['qty'] !== undefined;
  }
}
