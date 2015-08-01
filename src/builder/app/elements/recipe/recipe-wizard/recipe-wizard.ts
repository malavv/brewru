/// <reference path="../../../src/defs/es6-promise/es6-promise.d.ts" />

/// <reference path="../../../src/defs/polymer/polymer.ts" />
/// <reference path="../../../src/base/conceptRef.ts" />
/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/base/quantity.ts" />
/// <reference path="../../../src/errors.ts" />

/// <reference path="../../../src/ingredientSrc.ts" />
/// <reference path="../../../src/recipe.ts" />

/// <reference path="wizardStep.ts" />
/// <reference path="heatingFactory.ts" />
/// <reference path="addIngredientFactory.ts" />

class AppMenuWrapper {
  val: string;
  toString() : string { return this.val; }
  constructor(val:string) { this.val = val; }
}

class RecipeWizard extends Polymer.DomModule {
  /* Is the Panel Opened? Coming from IronOverlay. */
  private opened: boolean;
  isChoosing: boolean;
  selected: number;

  selectedTmpl: number;
  description: string;
  _textInput: any;
  textValue: string;
  
  _qty: Quantity;
  
  // Properties
  inventory: IngredientSrc;
  recipe: Recipe;

  // Menu
  _menuItems: Array<any>
  _menuSelected: any;

  // Ingredient
  _ingItems: Array<any>;
  _ingSelected: any;
  _ingQty: Quantity;

  _currentResolve: (l:any) => void;
  _currentReject: () => void;

  ready() {
    this.isChoosing = false;
    this._textInput = this.$._textInput;
    bus.suscribe(MessageType.CreateStep, this.onCreateStep, this);
  }

  onCreateStep(data: any) {
    if (this.isChoosing) return;

    this.askStepType()
      .then((ref: ConceptRef) => { 
        return this.create(ref); 
      })
      .then((factory: IStepFactory) => { 
        return this.query(this.inventory.stocks, factory); 
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

  public create(concept: ConceptRef): Promise<IStepFactory> {
    switch (concept.ref) {
      case StepType.addIngredient.ref:
        return Promise.resolve(new AddIngredientFactory());
      case StepType.heating.ref:
        return Promise.resolve(new HeatingFactory());
      default:
        console.warn('StepFactory<create>');
        return Promise.reject(new UnimplementedError());
    }
  }

  public askText(data: { description: string }): Promise<string> {
    this.description = (data === undefined || data.description === undefined) ? "" : data.description;
    this.selectedTmpl = 1;
    this.opened = true;

    return new Promise((resolve, reject) => {
        this._currentResolve = resolve;
        this._currentReject = reject;
    }).then(RecipeWizard.isTextChoiceValid)
  }

  public askMenu(data: Array<any>): Promise<ConceptRef> {
    if (data === undefined)
      return undefined;
    if (data.length === 0)
      return Promise.resolve();
    if (typeof (data[0]) === 'string')
      data = RecipeWizard.wrap(<string[]>data);

    // Feed items to menu
    this._menuSelected = undefined;
    this._menuItems = data;
    // Select menu
    this.selectedTmpl = 0;
    // Show Wizard.
    this.opened = true;

    return new Promise((resolve, reject) => {
        this._currentResolve = resolve;
        this._currentReject = reject;
    }).then(RecipeWizard.isMenuChoiceValid.bind(this, this._menuItems))
  }


  public askIngredient(type: IngredientType): Promise<{ ingredient: Ingredient; quantity: Quantity }> {
    if (type === undefined) {
        console.log('Undefined ingredient type');
        return Promise.reject(new CancelError());
    }
    this._ingItems = undefined;

    if (type === IngredientType.Dynamic) {
      this._ingItems = this.recipe.listDynamicIngredients();
    } else {
      this._ingItems = this.inventory.stocks.filter((i:Ingredient) => i.type === type);
    }    

    // Select menu
    this.selectedTmpl = 2;
    // Show Wizard.
    this.opened = true;

    return new Promise((resolve, reject) => {
        this._currentResolve = resolve;
        this._currentReject = reject;
    }).then(RecipeWizard.isIngredientChoiceValid.bind(this, this._ingItems))
  }

  public askQuantity(config: { description: string; allowed: Array<Dim> }): Promise<Quantity> {
    this.description = config.description;
    this._qty = undefined;
    
    // Select menu
    this.selectedTmpl = 3;
    // Show Wizard.
    this.opened = true;
    
    return new Promise((resolve, reject) => {
        this._currentResolve = resolve;
        this._currentReject = reject;
    }).then(RecipeWizard.isQuantityChoiceValid)
  }

  private static isQuantityChoiceValid(data: { qty: Quantity }) {
    return data.qty !== undefined ? Promise.resolve(data.qty) : Promise.reject('');
  }

  private static isIngredientChoiceValid(items: Array<any>, type: number) {
    if (type !== undefined && typeof(type) === 'number' && type >= 0 && type < items.length)
      return Promise.resolve((items[type] instanceof AppMenuWrapper) ? items[type].val : items[type]);
    return Promise.reject(new CancelError());
  }

  private static isTextChoiceValid(result: { description: string; value?: string; }) {
    return result.value !== undefined ? Promise.resolve(result.value) : Promise.reject(new CancelError());
  }

  private static isMenuChoiceValid(items: Array<any>, type: number) {
    if (type !== undefined && typeof(type) === 'number' && type >= 0 && type < items.length)
      return Promise.resolve((items[type] instanceof AppMenuWrapper) ? items[type].val : items[type]);
    return Promise.reject(new CancelError());
  }

  private static wrap(data: Array<string>): Object[] {
    return data.map(s => new AppMenuWrapper(s));
  }

  public query(ingredients: any, factory: IStepFactory): Promise<IStepFactory> {
    return Promise.resolve(factory.next())
      .then(this.processNext.bind(this, factory))
      .then(() => {
        this.selectedTmpl = 0;
        this.opened = false;
        return Promise.resolve(factory);
      });
  }

  private _askScreen(c: WizardConfig) : Promise<any> {
    switch(c.wizardPanel) {
        case WizardStep.ingredient: 
            return this.askIngredient(c.config);
          break;
        case WizardStep.menu: 
          return this.askMenu(c.config);
        case WizardStep.quantity:
          return this.askQuantity(c.config);
        case WizardStep.text: 
          return this.askText(c.config);
        default:
          return Promise.reject(new Error('Invalid Wizard Step'));
    }
  }

  public processNext(factory: IStepFactory, c: WizardConfig): Promise<any> {
    return this._askScreen(c)
      .then(RecipeWizard.registerData.bind(this, factory.data, c.propertyName))
        .then(() => {
          var next:WizardConfig = factory.next();
          if (next === undefined) return Promise.resolve(factory);
          else return this.processNext(factory, next);
        });
  }

  private static registerData(result: { [key: string]: any; }, key: string, data: any) {
    result[key] = data;
  }

  _menuSelectedChanged(newIdx: any, oldIdx: any) {
    if (this.opened && this.selectedTmpl === 0) {
      var
        resolve = this._currentResolve,
        reject = this._currentReject;
      this._currentResolve = undefined;
      this._currentReject = undefined;
      this.async(() => {
        (<WidgetList><any>this.$$('#menu widget-list')).clear();
      }, 1);
      resolve(newIdx);
    }
  }
  _textCommit() {
    if (this.opened && this.selectedTmpl === 1) {
      this._currentResolve({description: this.description, value: this.textValue});
      this._currentResolve = undefined;
      this._currentReject = undefined;
    }
  }
  _ingSelectedChanged(newIdx: any, oldIdx: any) {
    if (this.opened && this.selectedTmpl === 2) {
      var
        resolve = this._currentResolve,
        reject = this._currentReject;
      this._currentResolve = undefined;
      this._currentReject = undefined;
      this.async(() => {
        (<WidgetList><any>this.$$('#ingredient widget-list')).clear();
      }, 1);
      resolve(newIdx);
    }
  }
  _qtyChanged() {
    if (this.opened && this.selectedTmpl === 3) {
      this._currentResolve({description: this.description, qty:this._qty});
      this._currentResolve = undefined;
      this._currentReject = undefined;
    }
  }
}

window.Polymer(window.Polymer.Base.extend(RecipeWizard.prototype, {
  is: 'recipe-wizard',

  properties: {
    inventory: {
      type: Object,
      value: undefined
    },
    recipe: {
      type: Object,
      value: undefined
    },

    selectedTmpl: {
      type: Number,
      value: 0
    },
    textValue: {
      type: String
    },
    // Menu
    _menuItems: Array,
    _menuSelected: {
      type: Object,
      observer: '_menuSelectedChanged'
    },
    // Ingredient
    _ingItems: Array,
    _ingSelected: {
      type:Object,
      observer: '_ingSelectedChanged'
    },
    _ingQty: {
      type:Object,
      observer: '_ingQtyChanged'
    },
    _qty: {
      type: Quantity,
      observer: '_qtyChanged'
    }
  },

  behaviors: [
    Polymer.IronOverlayBehavior
  ]
}));