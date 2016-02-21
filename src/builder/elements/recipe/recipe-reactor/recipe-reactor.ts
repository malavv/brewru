/// <reference path="../../../lib/polymer/polymer.ts" />

interface StepOrControl {
  isStep: boolean;
  step?: StepImpl | ProcessStepTarget;
  label: string;
}

function createStep(step: StepImpl | ProcessStepTarget) : StepOrControl {
  return {
    isStep: true,
    step: step,
    label: step instanceof StepImpl ? (<StepImpl> step).name : step.toString()
  };
}

class RecipeReactor extends Polymer.DomModule {
  buildingSteps: StepImpl[];
  recipe: Recipe;

  _recipeClass(soc: StepImpl | ProcessStepTarget) {
    if (soc instanceof ProcessStepTarget)
      return 'step lvl2 target';

    switch ((<StepImpl>soc).type) {
      case StepImplType.cooling:
        return 'step lvl1 cooling';
      case StepImplType.equipment:
        return 'step lvl0 equipment';
      case StepImplType.fermenting:
        return 'step lvl1 fermenting';
      case StepImplType.heating:
        return 'step lvl1 heating';
      case StepImplType.ingredient:
        return 'step ingredient';
      case StepImplType.unknown:
        return 'step unknown';
      default:
        return 'step unknown';
    }
  }
  _recipeChanged() {
    var
      reactors = this.recipe.getReactors(),
      controls:StepOrControl[] = [];

    // For each equipment group
    // Add an add that skips all ing or misc.
    reactors.forEach((reactor) => {
      controls.push(createStep(reactor));
      reactor.getSteps().forEach(step => {
        if (step instanceof ProcessStep) {
          controls.push(createStep(step));
          (<ProcessStep> step).getTargets().forEach(target => {
            controls.push(createStep(target));
            target.getIng().forEach(ing => controls.push(createStep(ing)));
          });
        } else
          controls.push(createStep(step))
      });
    });

    this.set('buildingSteps', controls);
  }

  _onTap() {
    console.log("_onTap");
  }
}

window.Polymer(window.Polymer.Base.extend(RecipeReactor.prototype, {
  is: 'recipe-reactor',

  properties: {
    recipe: {
      type: Object,
      observer: '_recipeChanged'
    },
    buildingSteps: {
      type: Array
    }
  }
}));