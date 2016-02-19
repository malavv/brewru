/// <reference path="../../../lib/polymer/polymer.ts" />

enum ControlType {
  add
}

interface Control {
  type: ControlType;
  step?: StepImpl;
}

interface StepOrControl {
  isStep: boolean;
  step?: StepImpl;
  control?: Control;
  label: string;
}

function createStep(step: StepImpl | ProcessStepTarget) : StepOrControl {
  return {
    isStep: true,
    step: step,
    label: step.name == null ? step.toString() : step.name
  };
}
function createControl(control: Control) : StepOrControl {
  return {
    isStep: false,
    control: control,
    label: '+'
  };
}

class RecipeReactor extends Polymer.DomModule {
  buildingSteps: StepImpl[];
  recipe: Recipe;

  _recipeClass(soc: StepOrControl) {
    if (soc.isStep) {
      if (soc.step instanceof ProcessStepTarget)
        return 'step target';
      switch (soc.step.type) {
        case StepImplType.cooling:
          return 'step cooling';
        case StepImplType.equipment:
          return 'step equipment';
        case StepImplType.fermenting:
          return 'step fermenting';
        case StepImplType.heating:
          return 'step heating';
        case StepImplType.ingredient:
          return 'step ingredient';
        case StepImplType.miscellaneous:
          return 'step miscellaneous';
        case StepImplType.unknown:
          return 'step unknown';
        default:
          return 'step unknown';
      }
    }
    switch(soc.control.type) {
      case ControlType.add:
        return 'new';
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