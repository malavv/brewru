/// <reference path="../../../lib/polymer/polymer.ts" />

enum ControlType {
  add
}

interface Control {
  type: ControlType;
}

interface StepOrControl {
  isStep: boolean;
  step?: StepImpl;
  control?: Control;
  label: string;
}

function createStep(step: StepImpl) : StepOrControl {
  return {
    isStep: true,
    step: step,
    label: step.name
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
  recipe: RecipeImpl;

  _recipeClass(soc: StepOrControl) {
    if (soc.isStep) {
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
    var controls = [];

    // First addition has no associated step.
    controls.push(createControl({type: ControlType.add}));

    // Begin with basic steps.
    var inIngredient = false;

    this.recipe.steps.forEach((step : StepImpl) => {

      if (step.type == StepImplType.ingredient) {
        inIngredient = true;
        controls.push(createStep(step));
        return;
      }
      if (step.type == StepImplType.miscellaneous) {
        inIngredient = true;
        controls.push(createStep(step));
        return;
      }

      if (inIngredient) {
        inIngredient = false;
        controls.push(createControl({type: ControlType.add}));
      }

      controls.push(createStep(step));
    });

    if (inIngredient) {
      inIngredient = false;
      controls.push(createControl({type: ControlType.add}));
    }

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