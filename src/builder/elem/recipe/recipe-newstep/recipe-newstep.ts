/// <reference path="../../../src/base/polymer.d.ts" />
/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/recipeBuilder.ts" />
/// <reference path="../../../src/step/wizard.ts" />
/// <reference path="../../../src/step/stepFactory.ts" />
/// <reference path="../../../src/step.ts" />

/// <reference path="../../../src/promise.d.ts" />
  
class RecipeNewstep {
  isChoosing: boolean;
  builder: RecipeBuilder;
  
  ready() {
    bus.suscribe(MessageType.CreateStep, this.onCreateStep, this);
    this.isChoosing = false;
  }
  
  onCreateStep(data:any) {
    if (this.isChoosing) return;
    
    var factory: Promise<StepFactory>;
    factory = Wizard.askStepType().then(StepFactory.create);
    factory.catch((e: Error) => {
       this.isChoosing = false;
       console.info("No step type chosen.");
    })
    
    var step: Promise<Step[]>;
    step = factory.then(Wizard.query.bind(this, this.builder.inventory.stocks))
      .then((stepFactory: IStepFactory) => { return stepFactory.build(); }) // How to do better?
    step.catch((e: Error) => {
       this.isChoosing = false;
       console.info("Wizard issue, Wizard Canceled, or Step building failure");
    })
    
    step.then((step: Step[]) => {
      step.forEach((s:Step) => {
        bus.publish(MessageType.NewStepCreated, s);
      })
    });
  }  
}  

if (!Polymer.getRegisteredPrototype('recipe-newstep')) {
  Polymer('recipe-newstep', RecipeNewstep.prototype);
}