/// <reference path="StepImpl.ts" />
/// <reference path="../knowledge/domain/equipment.ts" />

class EquipmentStep extends StepImpl {
  private steps: StepImpl[] | GroupStep[];
  private equipment:Equipment;

  constructor(equipment: Equipment, recipe: Recipe) {
    super(equipment.name, StepImplType.equipment, recipe);
    this.equipment = equipment;
    this.steps = [];
  }

  public addIng(name: string, ingredient: Supply.Ing, quantity: Quantity) : EquipmentStep {
    this.steps.push(new IngredientStep(name, ingredient, quantity, this.recipe));
    return this;
  }

  public heat(name: string, target:(TempTarget|TimeTarget)) : EquipmentStep {
    this.steps.push(new HeatingStep(name, this.recipe, target));
    return this;
  }

  public getHeat() : HeatingStep[] {
    return <HeatingStep[]> this.steps.filter(s => s instanceof HeatingStep);
  }
  public getFerm() : FermentationStep[] {
    return <FermentationStep[]> this.steps.filter(s => s instanceof FermentationStep);
  }

  public cool(name:string, target:TempTarget):EquipmentStep {
    return this;
  }

  public transferTo(newEquipment:Equipment, characteristics:MiscStepType[]): EquipmentStep {
    var tmp = new EquipmentStep(newEquipment, this.recipe);
    this.recipe.addEquipment(tmp);
    return tmp;
  }
  public ferment(name: string, target:(TempTarget|TimeTarget)) : EquipmentStep {
    this.steps.push(new FermentationStep(name, this.recipe, target));
    return this;
  }
}