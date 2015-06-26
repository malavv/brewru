/// <reference path="../promise.d.ts" />
/// <reference path="../base/conceptRef.ts" />
/// <reference path="../base/eventBus.ts" />
/// <reference path="../base/messageType.ts" />
/// <reference path="../ingredient.ts" />
/// <reference path="stepFactory.ts" />



enum WizardInfo {
  ingredient,
  name,
  quantity
}

interface IWizardScreen {
    (config: any) : Promise<any>;
}

class WizardConfig {
  propertyName: string;
  wizardScreen: IWizardScreen;
  config: any;
  
  constructor(propertyName: string, wizardScreen: IWizardScreen, config: any) {
    this.propertyName = propertyName;
    this.wizardScreen = wizardScreen;
    this.config = config;
  }
}

class Wizard {
  /** Ask the user to choose a step type. */
  public static askStepType() : Promise<ConceptRef> {
    return AppMenu.ask(Step.Type.All);
  }

  public static query(ingredients: any, factory: IStepFactory) : Promise<StepFactory> {
    return Promise.resolve(factory.next())
      .then(Wizard.processNext.bind(this, factory))
      .then(() => { return Promise.resolve(factory); });
  }
  
  public static processNext(factory: IStepFactory, c: WizardConfig) : Promise<any> {
    return c.wizardScreen(c.config)
      .then(Wizard.registerData.bind(this, factory.data, c.propertyName))
      .then(() => {
        var next: WizardConfig = factory.next();
        if (next === undefined) return Promise.resolve(factory);
        else return Wizard.processNext(factory, next);
      });
  }
  
  private static registerData(result: { [key: string]: any; }, key: string, data: any) {
    result[key] = data;
  }
}
