/// <reference path="knowledge/domain/style.ts" />

class Recipe {
  // Unique reference
  private id:string;

  // Recipe Metadata
  public name:string;
  public description:string;
  public style:Style;
  public data:{substance:string[], reactors:string[], steps:any[]};

  // Set of chained reactor describing the process.
  private reactors:EquipmentStep[];

  constructor(base:Equipment) {
    if (base == null)
      Log.error("Recipe", "Must provide an equipment.");

    this.id = 'unimplemented';
    this.reactors = [
      new EquipmentStep(base, this)
    ];
    this.data = Recipe.getData();
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

  public static getData() : { substance:string[], reactors:string[], steps:any[], properties:any[] } {
    return {
      "substance": [
        //"water",
        "calcium",
        "magnesium",
        "bicarbonate",
        "chlore",
        "sodium",
        "sulfate",
        "alphalupulin"
      ],
      "reactors": [
        "kettle"
      ],
      "properties": [
        "time",
        "volume",
        "temperature"
      ],
      "steps": [
        { "reac": 0, "prop": [1, 23.0, 55.0], "sub": [1277.778, 0.009,0.008,0.0005,0.0005,0.0005,0.0005, 0] },
        { "reac": 0, "prop": [2, 23.1, 56.0], "sub": [1277.778, 0.009,0.008,0.0005,0.0005,0.0005,0.0005, 0] },
        { "reac": 0, "prop": [3, 23.5, 100.0], "sub": [1277.778, 0.009,0.008,0.0005,0.0005,0.0005,0.0005, 0] },
        { "reac": 0, "prop": [170, 23.5, 100.0], "sub": [1277.778, 0.009,0.008,0.0005,0.0005,0.0005,0.0005, 0.2] }
      ]
    };
  }
}