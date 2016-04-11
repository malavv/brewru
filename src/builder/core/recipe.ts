/// <reference path="knowledge/domain/style.ts" />

class Recipe {
  // Unique reference
  private ref:string;

  // Recipe Metadata
  public name:string;
  public description:string;
  public style:Style;

  // Set of chained reactor describing the process.
  private reactors:EquipmentStep[];

  constructor(base:Equipment) {
    if (base == null)
      Log.error("Recipe", "Must provide an equipment.");

    this.ref = 'unimplemented';
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


  public insertAfter(newStep : EquipmentStep, afterThis : EquipmentStep) : EquipmentStep {
    var idx = this.reactors.indexOf(afterThis);
    if (idx === -1) Log.warn("Recipe", "Inserting in an unknown idx.");
    this.reactors.splice(idx + 1, 0, newStep);
    return newStep;
  }

  public addEquipment(v : EquipmentStep) : Recipe {
    this.reactors.push(v);
    return this;
  }

  /** Encodes the recipe for communication with the server.  */
  public encode() : Object {
    return {
      ref: this.ref,
      name: this.name,
      description: this.description,
      style: this.style != null ? this.style.iri : null,
      reactors: (<Encodable[]>this.reactors).map(r => r.encode())
    };
  }
}
