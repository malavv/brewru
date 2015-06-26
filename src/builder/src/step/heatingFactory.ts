/// <reference path="wizard.ts" />
/// <reference path="stepFactory.ts" />
/// <reference path="../step.ts" />

/// <reference path="../../elem/app/app-text/app-text.ts" />
/// <reference path="../../elem/app/app-quantity/app-quantity.ts" />
/// <reference path="../../elem/app/app-menu/app-menu.ts" />

class HeatingFactory implements IStepFactory {
  private state:number = 0;

  data: { [key: string]: any; } = {};

  next(): WizardConfig {
    switch(this.state) {
      case 0: // Get Name
        this.state = 1;
        return new WizardConfig('name', AppText.ask, { description: 'Heating Step Name' });
      case 1:
        this.state = 2;
        return new WizardConfig('menu', AppMenu.ask, ["time", "temperature"]);
      case 2:
        this.state = 3;
        if (this.data['menu'] == "temperature")
          return new WizardConfig('qty', AppQuantity.ask, { description: 'Heat the reactor to :', allowed: [ Dim.Temperature ]});
        if (this.data['menu'] == "time")
          return new WizardConfig('qty', AppQuantity.ask, { description: 'Keep last set temp for :', allowed: [ Dim.Temporal ]});
      default: return undefined;
    }
  }

  build(): Step[] {
    if (this.data['menu'] == 'time') {
      return [
         new Step(this.data['name'] + '(start)', StepType.heating),
         new Step(this.data['name'] + '(reached)', StepType.heating)
      ];
    }
    if (this.data['menu'] == 'temperature') {
      return [new Step(this.data['name'], StepType.heating)];
    }
    return [new Step(this.data['name'], StepType.heating)];
  }

  isComplete(): boolean {
    return this.data['name'] !== undefined && this.data['qty'] !== undefined;
  }
}
