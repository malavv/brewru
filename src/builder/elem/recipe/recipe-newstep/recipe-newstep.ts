/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/recipeBuilder.ts" />

/// <reference path="../../../src/base/Keyboard.ts" />
/// <reference path="../../../src/shortcuts.ts" />
/// <reference path="../../../src/promise.d.ts" />

var Polymer:Function = Polymer || function () {}

class StepState {
  name: string;
  ingredient: Ingredient;
  type: string;
}

var Menu;

  function StepBuilder(step) {
    this.step = step;
    this.ingredient;
    this.timing;
    this.qty;
  }

  function registerType(state, data) {
    if (data === null) return Promise.reject("");
    state.type = data.name;
    return state;
  }
  function registerName(state, data) {
    if (data === null) return Promise.reject("");
    state.name = data.value;
    return state;
  }
  function registerIngredient(state, data) {
    if (data === null) return Promise.reject("");
    state.ingredient = data.ingredient;
    state.qty = data.quantity;
    return state;
  }
  
class RecipeNewstep {
  private static Steps:Array<Step> = [
      new Step('Add Ingredient', null),
      new Step('Heating', null),
      new Step('Splitting', null),
      new Step('Merging', null),
      new Step('Create Ingredient', null),
      new Step('Ferment', null)
    ];
  isChoosing:boolean = false;
  builder: RecipeBuilder;
  ready() {
    bus.suscribe(MessageType.CreateStep, this.onCreateStep, this);
  }
  
  onCreateStep(data) {
    console.log('recipe-newstep : onCreateStep')
    if (this.isChoosing) return;
    this.beginBuilder()
      .then(this.onStateMachine.bind(this))
      .then(this.endBuilder.bind(this))
      .then(this.sendResult.bind(this))
      .catch(function() {
        // If there was an error, just catch so nothing crashes.
      });
  }
  
  beginBuilder() {
    this.isChoosing = true;
    return Promise.resolve(new StepState());
  }
  
  endBuilder(state) {
    this.isChoosing = false;
    return state;
  }
  
  sendResult(state) {
    bus.publish(MessageType.NewStepCreated, state);
    return state;
  }
  
  onStateMachine(state) {
    state.type = state.type || null;
    state.name = state.name || null;
    state.ingredient = state.ingredient || null;
    if (state.type === null) return this.askType(state);
    if (state.name === null) return this.askName(state);
    if (state.ingredient === null) return this.askIngredient(state);
    return state;
  }
  
  onBegin() {
    this.isChoosing = true;
  }
  
  askType(state) {
    console.log('asktype')
    return bus.publishAndWaitFor(MessageType.AnswerMenu, MessageType.AskMenu, RecipeNewstep.Steps)
      .then(registerType.bind(this, state))
      .then(this.onStateMachine.bind(this))
      .catch(function() {
        // If there was an error, just catch so nothing crashes.
      });
  }
  askName(state) {
    return bus.publishAndWaitFor(MessageType.AnswerText, MessageType.AskText, 'Task Name')
      .then(registerName.bind(this, state))
      .then(this.onStateMachine.bind(this));
  }
  askIngredient(state) {
    return bus.publishAndWaitFor(MessageType.AnswerIngredient, MessageType.AskIngredient, this.builder.inventory.stocks)
      .then(registerIngredient.bind(this, state))
      .then(this.onStateMachine.bind(this));
  }

  onAnswerMenu(data) {
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
  onChosenIngredient(stepBld, ingredient) {
    stepBld.ingredient = ingredient.selected;
    Menu.ask(['After', 'OnTrigger']).then(this.onChooseStep.bind(this, stepBld));
  }
  onChooseStep(stepBld, timing) {
    stepBld.timing = timing.selected;
    var steps = [];
    this.builder.recipe.reactors.forEach(function(reactor) {
      reactor.steps.forEach(function(step) {
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
  onStepChosen(stepBld, step) {
    stepBld.qty = prompt("Enter quantity");
    step.selected.reactor.addAfter(
      step.selected.step, stepBld
    );
  }
}  

Polymer(RecipeNewstep.prototype);