/// <reference path="../../../src/defs/es6-promise/es6-promise.d.ts" />

/// <reference path="../../../src/defs/polymer/polymer.ts" />
/// <reference path="../../../src/base/conceptRef.ts" />
/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/base/quantity.ts" />
/// <reference path="../../../src/errors.ts" />
/// <reference path="../../../src/recipeBuilder.ts" />

/// <reference path="wizardStep.ts" />
/// <reference path="heatingFactory.ts" />
/// <reference path="addIngredientFactory.ts" />

class RecipeWizard extends Polymer.DomModule {
  /* Is the Panel Opened? Coming from IronOverlay. */
  private opened: boolean;
  isChoosing: boolean;
  selected: number;
  builder: RecipeBuilder;
  menuitems: Array<any>
  selectedTmpl: number;

  ready() {
    this.isChoosing = false;

    bus.suscribe(MessageType.CreateStep, this.onCreateStep, this);
  }

  onCreateStep(data: any) {
    if (this.isChoosing) return;

    this.askStepType()
      .then((ref: ConceptRef) => { 
        return this.create(ref); 
      })
      .then((factory: IStepFactory) => { 
        return this.query(this.builder.inventory.stocks, factory); 
      })
      .then((stepFactory: IStepFactory) => { 
        return stepFactory.build(); 
      })
      .then((step: Step[]) => {
        step.forEach((s: Step) => {
          bus.publish(MessageType.NewStepCreated, s);
        })
      }).catch((e: Error) => {
        this.isChoosing = false;
        if (e instanceof CancelError) {
          console.info('Wizard Canceled');
        } else {
          console.error("Wizard issue, or Step building failure", e);
        }
      });
  }
  

  /** Ask the user to choose a step type. */
  public askStepType(): Promise<ConceptRef> {
    return this.askMenu(StepType.All);
  }

  public create(ref: ConceptRef): Promise<IStepFactory> {
    switch (ref.id) {
      case StepType.addIngredient.id:
        return Promise.resolve(new AddIngredientFactory());
      case StepType.heating.id:
        return Promise.resolve(new HeatingFactory());
      default:
        console.warn('StepFactory<create>');
        return Promise.reject(new UnimplementedError());
    }
  }

  public static askText(data: { description: string }): Promise<string> {
    return bus.publishAndWaitFor(MessageType.AnswerText, MessageType.AskText, data)
      .then(RecipeWizard.isTextChoiceValid);
  }

  public askMenu(data: Array<any>): Promise<ConceptRef> {
    if (data === undefined)
      return undefined;
    if (data.length === 0)
      return Promise.resolve();
    if (typeof (data[0]) === 'string')
      data = RecipeWizard.wrap(<string[]>data);

    // Feed items to menu
    this.menuitems = data;
    // Select menu
    this.selectedTmpl = 0;
    // Show Wizard.
    this.opened = true;

    return new Promise(()=>{});
    //return bus.publishAndWaitFor(MessageType.AnswerMenu, MessageType.AskMenu, data).then(RecipeWizard.isMenuChoiceValid);
  }


  public static askIngredient(type: IngredientType): Promise<{ ingredient: Ingredient; quantity: Quantity }> {
    return bus.publishAndWaitFor(MessageType.AnswerIngredient, MessageType.AskIngredient, type)
      .then(RecipeWizard.isIngredientChoiceValid);
  }

  public static askQuantity(config: { description: String; allowed: Array<Dim> }): Promise<Quantity> {
    return bus.publishAndWaitFor(MessageType.AnswerQuantity, MessageType.AskQuantity, config)
      .then(RecipeWizard.isQuantityChoiceValid);
  }

  private static isQuantityChoiceValid(data: { qty: Quantity }) {
    return data.qty !== undefined ? Promise.resolve(data.qty) : Promise.reject('');
  }

  private static isIngredientChoiceValid(data: { ingredient: Ingredient; quantity: Quantity }) {
    return (data.ingredient !== null && data.quantity !== null) ? Promise.resolve(data) : Promise.reject(new CancelError());
  }

  private static isTextChoiceValid(result: { description: string; value?: string; }) {
    return result.value !== undefined ? Promise.resolve(result.value) : Promise.reject(new CancelError());
  }

  private static isMenuChoiceValid(type?: ConceptRef) {
    return type !== undefined ? Promise.resolve(type) : Promise.reject(new CancelError());
  }

  private static wrap(data: Array<string>): Object[] {
    return data.map(s => new AppMenuWrapper(s));
  }

  public query(ingredients: any, factory: IStepFactory): Promise<IStepFactory> {
    return Promise.resolve(factory.next())
      .then(RecipeWizard.processNext.bind(this, factory))
      .then(() => {
        return Promise.resolve(factory);
      });
  }

  public static processNext(factory: IStepFactory, c: WizardConfig): Promise<any> {
    console.log('RecipeWizard Heavy Mod warning');

    return Promise.resolve();
    // return c.wizardScreen(c.config)
    //     .then(RecipeWizard.registerData.bind(this, factory.data, c.propertyName))
    //     .then(() => {
    //       var next:WizardConfig = factory.next();
    //       if (next === undefined) return Promise.resolve(factory);
    //       else return RecipeWizard.processNext(factory, next);
    //     });
  }

  private static registerData(result: { [key: string]: any; }, key: string, data: any) {
    result[key] = data;
  }
}

RecipeWizard.prototype.is = 'recipe-wizard';

RecipeWizard.prototype.properties = {
  builder: {
    type: RecipeBuilder,
    value: undefined
  },
  // Menu
  menuitems: Array,
  menuselection: Object,
  
  selectedTmpl: {
    type: Number,
    value: 0
  }
}

RecipeWizard.prototype.behaviors = [
  Polymer.IronOverlayBehavior
];