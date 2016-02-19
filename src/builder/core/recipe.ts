/// <reference path="knowledge/domain/style.ts" />

class Recipe {
  // Unique reference
  private id:string;

  // Recipe Metadata
  public name:string;
  public description:string;
  public style:Style;

  // Set of chained reactor describing the process.
  private reactors:EquipmentStep[];

  constructor(base:Equipment) {
    if (base == null)
      Log.error(Recipe, "Must provide an equipment.");

    this.id = 'unimplemented';
    this.reactors = [
      new EquipmentStep(base, this)
    ];
  }

  /**
   * Get all the reactors used in this recipe.
   * @returns {EquipmentStep[]}
   */
  getReactors() : EquipmentStep[] {
    return this.reactors;
  }

  getGroupedByEquipment():StepImpl[][] {
    var processGroup:StepImpl[][] = [];
    var lastProcessIdx:number = 0;

    for (var i = 0; i < this.reactors.length; i++) {
      if (this.reactors[i].type == StepImplType.equipment && i !== lastProcessIdx) {
        processGroup.push(this.reactors.slice(lastProcessIdx, i));
        lastProcessIdx = i;
      }
    }

    if (lastProcessIdx !== this.reactors.length) {
      processGroup.push(this.reactors.slice(lastProcessIdx, this.reactors.length));
    }

    return processGroup;
  }

  addEquipment(v : EquipmentStep) {
    this.reactors.push(v);
  }



  addIngredient(name: string, step:(EquipmentStep|ProcessStep), ingredient:Supply.Ing, quantity: Quantity) : Recipe {
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