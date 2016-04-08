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
      return 'step target';

    switch ((<StepImpl>soc).type) {
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

  _onTap(evt:any) {
    if (evt.model.reactor) {
      this.set('selected', evt.model.reactor);
      return;
    }
    if (evt.model.step) {
      this.set('selected', evt.model.step);
      return;
    }
    if (evt.model.target) {
      this.set('selected', evt.model.target);
      return;
    }
    if (evt.model.ing) {
      this.set('selected', evt.model.ing);
      return;
    }
  }

  _selectedChanged(lhs:any, rhs:any) {
    console.log('_selectedChanged', lhs, rhs);
  }
  test(val:any) {
    return JSON.stringify(val);
  }
  public getStepTemplate(val : StepImpl) : string {
    if (val instanceof EquipmentStep)
      return 'equipStep';
    return "default";
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
    },
    selected: {
      type: Object,
      observer: '_selectedChanged'
    }
  }
}));