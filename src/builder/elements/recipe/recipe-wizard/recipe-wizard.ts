/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />
/// <reference path="../../../lib/es6-promise/es6-promise.d.ts" />

/// <reference path="wizardStep.ts" />
/// <reference path="heatingFactory.ts" />
/// <reference path="addIngredientFactory.ts" />
/// <reference path="../../widget/widget-list/widget-list.ts" />

class NativeStrBox {
  val: string;
  toString() : string { return this.val; }
  constructor(val:string) { this.val = val; }
}

function boxNativeIfNeeded(data: Array<any>) : Array<any> {
  return typeof (data[0]) === 'string' ? data.map(s => new NativeStrBox(s)) : data;
}

function unboxNativeIfNeeded(item : any) : any {
  return item instanceof NativeStrBox ? (<NativeStrBox>item).val : item;
}

function registerData(result: { [key: string]: any; }, key: string, data: any) {
  result[key] = data;
}

enum WizardScreen {
  menu,
  text,
  ingredient,
  quantity
}

class RecipeWizard extends Polymer.DomModule {
  /* Is the Panel Opened? Coming from IronOverlay. */
  private opened: boolean;
  private isChoosing: boolean;
  private promise: {resolve:any;reject:any};

  // Internal
  selectedTmpl: number;
  
  // Properties
  inventory: IngredientSrc;
  recipe: Recipe;

  // All
  _description: string;
  // Text
  _text: string;
  // Menu
  _menuItems: Array<any>
  _menuSelected: any;
  // Ingredient
  _ingItems: Array<any>;
  _ingSelected: any;
  // Quantity
  _qty: Quantity;

  // Polymer.Base
  ready() {
    this.isChoosing = false;
    bus.suscribe(MessageType.CreateStep, this.onCreateStep, this);
  }
  
  /** Returns a promise asking for text. */
  public askText(data: { description: string }): Promise<string> {
    this._description = (data === undefined || data.description === undefined) ? "" : data.description;
    this.switchToScreen(WizardScreen.text);
    this.opened = true;
    return new Promise(this._storePromise.bind(this));
  }
  /** 
   * Returns a promise asking for an item from a menu.
   * 
   * This will auto-wrap native string array. 
   */
  public askMenu(data: Array<any>): Promise<ConceptRef> {
    // If nothing asked
    if (data === undefined || data.length === 0)  return Promise.resolve();
    
    this._menuSelected = undefined;
    this._menuItems = boxNativeIfNeeded(data);
    this.switchToScreen(WizardScreen.menu);
    this.opened = true;
    return new Promise(this._storePromise.bind(this));
  }
  /**
   * Returns a primuse asking for an item's quantity.
   */
  public askQuantity(config: { description: string; allowed: PhysQty[] }): Promise<Quantity> {
    this._description = config.description;
    this.$.qty.reset();
    this.$.qty.restrictDimensions(config.allowed);
    this._qty = undefined;
    this.switchToScreen(WizardScreen.quantity);
    this.opened = true;
    return new Promise(this._storePromise.bind(this));
  }
  /**
   * Returns a primuse asking for an ingredient.
   */
  public askIngredient(type: Supply.Type): Promise<{ ingredient: Supply.Ing; quantity: Quantity }> {
    if (type === undefined) return Promise.reject(new InvalidStateError());
    
    this._ingItems = [];
    this.switchToScreen(WizardScreen.ingredient); 
    this.opened = true;
    return new Promise(this._storePromise.bind(this));
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

  public query(ingredients: any, factory: IStepFactory): Promise<IStepFactory> {
    return Promise.resolve(factory.next())
      .then(this.processNext.bind(this, factory))
      .then(() => {
        this.selectedTmpl = 0;
        this.opened = false;
        return Promise.resolve(factory);
      });
  }

  public processNext(factory: IStepFactory, c: WizardConfig): Promise<any> {
    return this._askScreen(c)
      .then(registerData.bind(this, factory.data, c.propertyName))
      .then(() => {
        var next:WizardConfig = factory.next();
        if (next === undefined) return Promise.resolve(factory);
        else return this.processNext(factory, next);
      });
  }
  
  private _textChanged(newVal?: string, oldVal?: string) {
    if (!this.opened || this.selectedTmpl !== 1) return;
    if (newVal === undefined) return Promise.reject(new InvalidStateError());
    var promise = this.promise;
    this.promise = undefined;    
    this.async(() => {
      this._description = "";
      this._text = "";
    }, 1);    
    promise.resolve(newVal);
  }
  
  private _menuSelectedChanged(newIdx?: number, oldIdx?: number) {
    if (newIdx === undefined) return; // When reseting the value.
    var promise = this.promise;
    this.promise = undefined;
    if (!this.opened || this.selectedTmpl !== 0) {
      promise.reject(new InvalidStateError());
      return;
    }
    if (newIdx < 0 || newIdx >= this._menuItems.length) {
      promise.reject(new InvalidStateError());
      return;
    }
    var choice = this._menuItems[newIdx];
    this._menuItems = [];
    this._menuSelected = undefined;
    this.async(() => { 
      (<WidgetList><any>this.$$('#menu widget-list')).clear();
    }, 1);
    
    promise.resolve(unboxNativeIfNeeded(choice));
  }
  
  private _ingSelectedChanged(newIdx?: number, oldIdx?: number) {
    if (newIdx === undefined) return; // When reseting the value.
    var promise = this.promise;
    this.promise = undefined;
    if (!this.opened || this.selectedTmpl !== 2) {
      promise.reject(new InvalidStateError());
      return;
    }
    if (newIdx < 0 || newIdx >= this._ingItems.length) {
      promise.reject(new InvalidStateError());
      return;
    }
    var choice = this._ingItems[newIdx];
    this._ingItems = [];
    this._ingSelected = undefined;
    this.async(() => { 
      (<WidgetList><any>this.$$('#ingredient widget-list')).clear();
    }, 1);
    
    promise.resolve(unboxNativeIfNeeded(choice));
  }
  
  private _qtyChanged(newVal?: Quantity, oldVal?: Quantity) {
    if (newVal === undefined) return; // When reseting the value.
    var promise = this.promise;
    this.promise = undefined;
    if (!this.opened || this.selectedTmpl !== 3) {
      promise.reject(new InvalidStateError());
      return;
    }
    var choice = this._qty;
    this._qty = undefined;
    promise.resolve({
      description: this._description, 
      qty: choice
    });
  }
  
  private _storePromise(resolve:any, reject:any) {
    this.promise = {
      resolve: resolve, 
      reject: reject
    };
  }
  
  private switchToScreen(screen:WizardScreen) {
    var screenId = -1;
    switch (screen) {
      case WizardScreen.menu: this.selectedTmpl = 0; break;
      case WizardScreen.text: this.selectedTmpl = 1; break;
      case WizardScreen.ingredient: this.selectedTmpl = 2; break;
      case WizardScreen.quantity: this.selectedTmpl = 3; break;
      default: console.warn('Unrecognized Screen requested');
    }
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
  private onCreateStep(data: any) {
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
      })
      .catch((e: Error) => {
        this.isChoosing = false;
        if (e instanceof CancelError) {
          console.info('Wizard Canceled');
        } else {
          console.error("Wizard issue, or Step building failure", e);
        }
      });
  }
}

window.Polymer(window.Polymer.Base.extend(RecipeWizard.prototype, {
  is: 'recipe-wizard',

  properties: {
    // ----------- Outside  -----------
    inventory: {
      type: Object,
      value: undefined
    },
    recipe: {
      type: Object,
      notify: true
    },
    
    // ----------- Internal -----------
    // Selects the Wizard Page.
    selectedTmpl: {
      type: Number,
      value: 0
    },
    // Used to describe pages (used in more than one)
    _description: String,
    // Value of the Text Page.
    _text: {
      type:String,
      observer: '_textChanged'
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