class HeatingFactory implements IStepFactory {
  is:string = 'recipe-wizard';
  private state:number = 0;

  properties:any = {
    inventory: {type:IngredientSrc, value: undefined},
    recipe: {type:Recipe, value: undefined},
  }

  data:{ [key: string]: any; } = {};

  next():WizardConfig {
    switch (this.state) {
      case 0: // Get Name
        this.state = 1;
        return new WizardConfig('name', RecipeWizard.askText, {description: 'Heating Step Name'});
      case 1:
        this.state = 2;
        return new WizardConfig('menu', RecipeWizard.askMenu, ["time", "temperature"]);
      case 2:
        this.state = 3;
        if (this.data['menu'] == "temperature")
          return new WizardConfig('qty', RecipeWizard.askQuantity, {
            description: 'Heat the reactor to :',
            allowed: [Dim.Temperature]
          });
        if (this.data['menu'] == "time")
          return new WizardConfig('qty', RecipeWizard.askQuantity, {
            description: 'Keep last set temp for :',
            allowed: [Dim.Temporal]
          });
      default:
        return undefined;
    }
  }

  build():Step[] {
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

  isComplete():boolean {
    return this.data['name'] !== undefined && this.data['qty'] !== undefined;
  }
}


class AddIngredientFactory implements IStepFactory {
  private state:number = 0;

  data:{ [key: string]: any; } = {};

  next():WizardConfig {
    switch (this.state) {
      case 0: // Get Name
        this.state = 1;
        return new WizardConfig('name', RecipeWizard.askText, {description: 'Ingredient Step Name'});
      case 1:
        this.state = 2;
        return new WizardConfig('menu', RecipeWizard.askMenu, ["dynamic", "fermentables", "hops", "yeast", "miscellaneous"]);
      case 2:
        this.state = 3;
        return new WizardConfig('qty', RecipeWizard.askIngredient, this.name2type(this.data['menu']));
      default:
        return undefined;
    }
  }

  name2type(name:string):IngredientType {
    switch (this.data['menu']) {
      case 'dynamic':
        return IngredientType.Dynamic;
      case 'fermentables':
        return IngredientType.Fermentables;
      case 'hops':
        return IngredientType.Hops;
      case 'yeast':
        return IngredientType.Yeasts;
      case 'miscellaneous':
        return IngredientType.Miscellaneous;
    }
  }

  build():Step[] {
    return [new Step(this.data['name'], StepType.addIngredient)];
  }

  isComplete():boolean {
    return this.data['name'] !== undefined && this.data['qty'] !== undefined;
  }
}

class RecipeWizard {
  ready() {
  }

  /** Ask the user to choose a step type. */
  public static askStepType():Promise<ConceptRef> {
    return RecipeWizard.askMenu(Step.Type.All);
  }

  public static create(ref:ConceptRef):Promise<IStepFactory> {
    switch (ref.id) {
      case Step.Type.addIngredient.id:
        return Promise.resolve(new AddIngredientFactory());
      case Step.Type.heating.id:
        return Promise.resolve(new HeatingFactory());
      default:
        console.warn('StepFactory<create>');
        return Promise.reject(new UnimplementedError());
    }
  }

  public static askText(data:{ description: string }):Promise<string> {
    return bus.publishAndWaitFor(MessageType.AnswerText, MessageType.AskText, data)
        .then(RecipeWizard.isTextChoiceValid);
  }

  public static askMenu(data:Array<Object>):Promise<ConceptRef> {
    if (data === undefined)
      return undefined;
    if (data.length === 0)
      return Promise.resolve();
    if (typeof(data[0]) === 'string')
      data = RecipeWizard.wrap(<string[]>data);
    return bus.publishAndWaitFor(MessageType.AnswerMenu, MessageType.AskMenu, data)
        .then(RecipeWizard.isMenuChoiceValid);
  }


  public static askIngredient(type:IngredientType):Promise<{ingredient: Ingredient; quantity: Quantity}> {
    return bus.publishAndWaitFor(MessageType.AnswerIngredient, MessageType.AskIngredient, type)
        .then(RecipeWizard.isIngredientChoiceValid);
  }

  public static askQuantity(config:{ description: String; allowed: Array<Dim> }):Promise<Quantity> {
    return bus.publishAndWaitFor(MessageType.AnswerQuantity, MessageType.AskQuantity, config)
        .then(RecipeWizard.isQuantityChoiceValid);
  }

  private static isQuantityChoiceValid(data:{ qty: Quantity }) {
    return data.qty !== undefined ? Promise.resolve(data.qty) : Promise.reject('');
  }

  private static isIngredientChoiceValid(data:{ingredient: Ingredient; quantity: Quantity}) {
    return (data.ingredient !== null && data.quantity !== null) ? Promise.resolve(data) : Promise.reject(new CancelError());
  }

  private static isTextChoiceValid(result:{description: string; value?: string; }) {
    return result.value !== undefined ? Promise.resolve(result.value) : Promise.reject(new CancelError());
  }

  private static isMenuChoiceValid(type?:ConceptRef) {
    return type !== undefined ? Promise.resolve(type) : Promise.reject(new CancelError());
  }

  private static wrap(data:Array<string>):Object[] {
    return data.map(s => new AppMenuWrapper(s));
  }

  public static query(ingredients:any, factory:IStepFactory):Promise<IStepFactory> {
    return Promise.resolve(factory.next())
        .then(RecipeWizard.processNext.bind(this, factory))
        .then(() => {
          return Promise.resolve(factory);
        });
  }

  public static processNext(factory:IStepFactory, c:WizardConfig):Promise<any> {
    return c.wizardScreen(c.config)
        .then(RecipeWizard.registerData.bind(this, factory.data, c.propertyName))
        .then(() => {
          var next:WizardConfig = factory.next();
          if (next === undefined) return Promise.resolve(factory);
          else return RecipeWizard.processNext(factory, next);
        });
  }

  private static registerData(result:{ [key: string]: any; }, key:string, data:any) {
    result[key] = data;
  }
}
