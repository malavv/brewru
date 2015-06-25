/// <reference path="../../src/promise.d.ts" />
/// <reference path="../../src/base/conceptRef.ts" />
/// <reference path="../../src/base/eventBus.ts" />
/// <reference path="../../src/base/messageType.ts" />
/// <reference path="../../src/ingredient.ts" />
/// <reference path="stepFactory.ts" />

enum WizardInfo {
  ingredient,
  name,
  quantity
}

class WizardConfig {
  prop: string;
  info: WizardInfo;
  data: any;
  constructor(prop: string, info: WizardInfo, data: any) {
    this.prop = prop;
    this.info = info;
    this.data = data;
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
            .then(Wizard.askName.bind(this, config.data))
            .then(Wizard.registerData.bind(this, factory.data, config.prop));
        case WizardInfo.quantity:
          return sequence
            .then(Wizard.askQuantity.bind(this, config.data))
            .then(Wizard.registerData.bind(this, factory.data, config.prop));
        default:
          console.warn('Wizard<query> : Unknown widget type : ', config.info);
          return sequence;
      }
    }, Promise.resolve()).then(() => { return Promise.resolve(factory); });
  }
  
  static askName(config:{ description: String }) : Promise<String> {
    return bus.publishAndWaitFor(MessageType.AnswerText, MessageType.AskText, config)
      .then((data:{description: string; value: string}) => {
        if (data.value === null)  return Promise.reject("");
        return Promise.resolve(data.value);
      });
  }
  static askQuantity(config:{ description: String; allowed: Array<Dim> }) : Promise<String> {
    return bus.publishAndWaitFor(MessageType.AnswerQuantity, MessageType.AskQuantity, config)
      .then((data: {description: string; value: Quantity}) => {
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