/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/recipeBuilder.ts" />
/// <reference path="../../../src/step/stepState.ts" />
/// <reference path="../../../src/step.ts" />

/// <reference path="../../../src/base/Keyboard.ts" />
/// <reference path="../../../src/shortcuts.ts" />
/// <reference path="../../../src/promise.d.ts" />

var Polymer:Function = Polymer || function () {}

class StepBuilder {
  constructor(step:any) {
    this.step = step;
  }
  step:any;
  ingredient:any;
  timing:any;
  qty:any;
}

var Menu:any;

function registerType(state:StepState, type?:ConceptRef) : Promise<StepState> {
  if (type === null || type === undefined) 
    return Promise.reject("");
  state.type = type;
  return Promise.resolve(state);
}

function registerName(state:StepState, data:{description: string; value: string}) : Promise<StepState> {
  if (data.value === null)  return Promise.reject("");
  state.name = data.value;
  return Promise.resolve(state);
}
function registerIngredient(state:StepState, data:{ingredient?: Ingredient; quantity?: Quantity}) : Promise<StepState> {
  if (data.ingredient === null || data.quantity === null)
    return Promise.reject("");
  state.ingredient = data.ingredient;
  state.qty = data.quantity;
  return Promise.resolve(state);
}
  
class RecipeNewstep {
  isChoosing: boolean;
  builder: RecipeBuilder;
  
  ready() {
    bus.suscribe(MessageType.CreateStep, this.onCreateStep, this);
    this.isChoosing = false;
  }
  
  onCreateStep(data:any) {
    if (this.isChoosing) return;
    this.beginBuilder()
      .then(this.onStateMachine.bind(this))
      .then(this.endBuilder.bind(this))
      .then(this.sendResult.bind(this))
      .catch(() => {
        // If there was an error, just catch so nothing crashes.
        this.isChoosing = false;
        console.info("StepState[Cancel Step Factory]");
      });
  }
  
  onStateMachine(state:StepState) : Promise<StepState> {
    state.type = state.type || null;
    state.name = state.name || null;
    state.ingredient = state.ingredient || null;
    if (state.type === null) return this.askType(state);
    if (state.name === null) return this.askName(state);
    if (state.ingredient === null) return this.askIngredient(state);
    return Promise.resolve(state);
  }
  
    
  beginBuilder() : Promise<StepState> {
    this.isChoosing = true;
    return Promise.resolve(new StepState());
  }
  
  endBuilder(state:StepState) {
    this.isChoosing = false;
    return state;
  }
  
  sendResult(state:StepState) {
    bus.publish(MessageType.NewStepCreated, state);
    return state;
  }
  
  askType(state:StepState) : Promise<StepState> {
    return bus.publishAndWaitFor(MessageType.AnswerMenu, MessageType.AskMenu, Step.Type.All)
      .then(registerType.bind(this, state))
      .then(this.onStateMachine.bind(this));
  }
  askName(state:StepState) : Promise<StepState> {
    return bus.publishAndWaitFor(MessageType.AnswerText, MessageType.AskText, 'Task Name')
      .then(registerName.bind(this, state))
      .then(this.onStateMachine.bind(this));
  }
  askIngredient(state:StepState) : Promise<StepState> {
    return bus.publishAndWaitFor(MessageType.AnswerIngredient, MessageType.AskIngredient, this.builder.inventory.stocks)
      .then(registerIngredient.bind(this, state))
      .then(this.onStateMachine.bind(this));
  }

  onAnswerMenu(data:any) {
    switch (data.selected.name) {
      case 'Add Ingredient':
        this.onAddingIngredient();
        break;
    }
    this.isChoosing = false;
  }
  
  onAddingIngredient() {
    Menu.ask(this.builder.ingredients.listAllIngredients())
      .then(this.onChosenIngredient.bind(this, new StepBuilder('Add Ingredient')));
  }
  
  onChosenIngredient(stepBld:StepBuilder, ingredient:any) {
    stepBld.ingredient = ingredient.selected;
    Menu.ask(['After', 'OnTrigger']).then(this.onChooseStep.bind(this, stepBld));
  }
  
  onChooseStep(stepBld:StepBuilder, timing:any) {
    stepBld.timing = timing.selected;
    var steps:Array<any> = [];
    this.builder.recipe.reactors.forEach(function(reactor:any) {
      reactor.steps.forEach(function(step:any) {
        steps.push({
          reactor: reactor,
          step: step,
          toString: function() {
            return this.reactor.name + ' - ' + this.step.name;
          }
        });
      });
    });

    Menu.ask(steps).then(this.onStepChosen.bind(this, stepBld));
  }
  onStepChosen(stepBld:StepBuilder, step:any) {
    stepBld.qty = prompt("Enter quantity");
    step.selected.reactor.addAfter(
      step.selected.step, stepBld
    );
  }
  
}  

Polymer(RecipeNewstep.prototype);