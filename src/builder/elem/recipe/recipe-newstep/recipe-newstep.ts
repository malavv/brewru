/// <reference path="../../../src/base/polymer.d.ts" />
/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/recipeBuilder.ts" />
/// <reference path="../../../src/step/wizard.ts" />
/// <reference path="../../../src/step/stepFactory.ts" />
/// <reference path="../../../src/step.ts" />
/// <reference path="../../../src/errors.ts" />

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
    
    Wizard.askStepType()
      .then(StepFactory.create)
      .then(Wizard.query.bind(this, this.builder.inventory.stocks))
      .then((stepFactory: IStepFactory) => { return stepFactory.build(); }) // How to do better?
      .then((step: Step[]) => {
        step.forEach((s:Step) => {
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
}  

if (!Polymer.getRegisteredPrototype('recipe-newstep')) {
  Polymer('recipe-newstep', RecipeNewstep.prototype);
}