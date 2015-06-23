/// <reference path="../../src/promise.d.ts" />
/// <reference path="../../src/base/conceptRef.ts" />
/// <reference path="stepFactory.ts" />

enum WizardInfo {
  ingredient,
  name  
}

class WizardConfig {
  prop: string;
  info: WizardInfo;
  constructor(prop: string, info: WizardInfo) {
    this.prop = prop;
    this.info = info;
  }
}

class Wizard {
  
  private static registerData(result: { [key: string]: any; }, key: string, data: any) {
    result[key] = data;
  }
  
  /** Ask the user to choose a step type. */
  public static askStepType() : Promise<ConceptRef> {
    return bus.publishAndWaitFor(MessageType.AnswerMenu, MessageType.AskMenu, Step.Type.All)
      .then((type?:ConceptRef) => {
        if (type === null || type === undefined) return Promise.reject("");
        return Promise.resolve(type);
      });
  }
  
  static query(ingredients: any, factory: IStepFactory) : Promise<StepFactory> {
    return factory.info.reduce((sequence: Promise<any>, config: WizardConfig) => {
      switch (config.info) {
        case WizardInfo.ingredient:
          return sequence
            .then(Wizard.askIngredient.bind(this, ingredients))
            .then(Wizard.registerData.bind(this, factory.data, config.prop));
        case WizardInfo.name:
          return sequence
            .then(Wizard.askName.bind(this, 'Task Name'))
            .then(Wizard.registerData.bind(this, factory.data, config.prop));
        default:
          console.warn('Wizard<query>');
          return sequence;
      }
    }, Promise.resolve()).then(() => { return Promise.resolve(factory); });
  }
  
  static askName(desc: String) : Promise<String> {
    return bus.publishAndWaitFor(MessageType.AnswerText, MessageType.AskText, 'Task Name')
      .then((data:{description: string; value: string}) => {
        if (data.value === null)  return Promise.reject("");
        return Promise.resolve(data.value);
      });
  }
  static askIngredient(stocks: any) : Promise<{ingredient: Ingredient; quantity: Quantity}> {
    return bus.publishAndWaitFor(MessageType.AnswerIngredient, MessageType.AskIngredient, stocks)
      .then((data: {ingredient: Ingredient; quantity: Quantity}) => {
        if (data.ingredient === null || data.quantity === null)
          return Promise.reject("");
        return data;
      });
  }
}