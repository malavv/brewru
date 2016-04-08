/// <reference path="StepImpl.ts" />
/// <reference path="../knowledge/domain/equipment.ts" />
/// <reference path="../knowledge/domain/substance.ts"/>
/// <reference path="../base/encodable.ts"/>

class EquipmentStep extends StepImpl implements Encodable {
  private steps: StepImpl[] | ProcessStep[];
  private equipment:Equipment;

  constructor(equipment: Equipment, recipe: Recipe) {
    super(equipment.ref, StepImplType.equipment, recipe);
    this.equipment = equipment;
    this.steps = [];
  }

  public addIng(name: string, ingredient: Substance, quantity: Quantity) : EquipmentStep {
    this.steps.push(new IngredientStep(name, ingredient, quantity, this.recipe));
    return this;
  }

  public heat(name: string, target:(TempTarget|TimeTarget)) : EquipmentStep {
    this.steps.push(new ProcessStep(name, StepImplType.heating, this.recipe, target));
    return this;
  }

  public getHeat() : ProcessStep[] {
    return <ProcessStep[]> this.steps.filter(s => s.type == StepImplType.heating);
  }
  public getSteps() : StepImpl[] | ProcessStep[] {
    return this.steps;
  }
  public getFerm() : ProcessStep[] {
    return <ProcessStep[]> this.steps.filter(s => s.type == StepImplType.fermenting);
  }

  public cool(name:string, target:TempTarget):EquipmentStep {
    return this;
  }

  public transferTo(newEquipment:Equipment, characteristics:MiscStepType[]): EquipmentStep {
    return this.recipe.insertAfter(new EquipmentStep(newEquipment, this.recipe), this);
  }

  public ferment(name: string, target:(TempTarget|TimeTarget)) : EquipmentStep {
    this.steps.push(new FermentationStep(name, StepImplType.fermenting, this.recipe, target));
    return this;
  }

  public toString() : String {
    if (this.equipment != null && this.equipment.getType() == 'Kettle')
      return this.equipment.getVolumeInL().toFixed(2) + ' L Kettle';
    return "Equip : " + this.name;
  }

  public encode() : Object {
    return {
      steps: this.steps.map(s => s.encode()),
      equipment: this.equipment != null ? this.equipment.ref : null
    }
  }
}
