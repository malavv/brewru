/// <reference path="knowledge/domain/style.ts" />

class Recipe {
  // Unique reference
  private id:string;

  // Recipe Metadata
  public name:string;
  public description:string;
  public style:Style;

  // Steps of the recipe
  private vessels:EquipmentStep[];

  constructor(base:Equipment) {
    if (base == null)
      Log.error(Recipe, "Must provide an equipment.");
    this.id = 'unimplemented';
    this.vessels = [
      new EquipmentStep(base, this)
    ];
  }

  getGroupedByEquipment():StepImpl[][] {
    var processGroup:StepImpl[][] = [];
    var lastProcessIdx:number = 0;

    for (var i = 0; i < this.vessels.length; i++) {
      if (this.vessels[i].type == StepImplType.equipment && i !== lastProcessIdx) {
        processGroup.push(this.vessels.slice(lastProcessIdx, i));
        lastProcessIdx = i;
      }
    }

    if (lastProcessIdx !== this.vessels.length) {
      processGroup.push(this.vessels.slice(lastProcessIdx, this.vessels.length));
    }

    return processGroup;
  }

  addEquipment(v : EquipmentStep) {
    this.vessels.push(v);
  }

  getEquipments() : EquipmentStep[] {
    return this.vessels;
  }

  addIngredient(name: string, step:(EquipmentStep|GroupStep), ingredient:Supply.Ing, quantity: Quantity) : Recipe {
    return this;
  }

  public transferTo(equipment : Equipment) : EquipmentStep {
    return null;
  }

  addAction(equipment:EquipmentStep, miscStep:MiscStep): Recipe {
    return this;
  }

  ferment(param:FermentationStep[]): FermentationStep {
    return null;
  }
}