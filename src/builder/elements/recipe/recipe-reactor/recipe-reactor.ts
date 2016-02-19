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
  recipe: Recipe;

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

    var controls:StepOrControl[] = [];

    var equipmentGroupedSteps = this.recipe.getGroupedByEquipment();

    console.log('Process Groups', equipmentGroupedSteps);

    // First addition has no associated step.
    controls.push(createControl({type: ControlType.add}));

    // For each equipment group
    // Add an add that skips all ing or misc.
    equipmentGroupedSteps.forEach((eg) => {
      var needAddition = true;

      for (var i = 0; i < eg.length; i++) {
        if (eg[i] instanceof GroupStep && needAddition)
          controls.push(createControl({type: ControlType.add}));
        controls.push(createStep(eg[i]));
      }

      if (needAddition)
        controls.push(createControl({type: ControlType.add}));
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