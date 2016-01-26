enum StepImplType {
  equipment,
  ingredient,
  heating,
  cooling,
  fermenting,
  miscellaneous,
  unknown
}

interface StepImpl {
  name: string;
  type: StepImplType;
}

class HeatingStep implements StepImpl {
  public static uid:number = 0;

  public name:string;
  public type:StepImplType;
  public groupId:number;

  constructor(name:string, groupId:number) {
    this.type = StepImplType.heating;
    this.name = name;
    this.groupId = groupId;
  }

  public static create(name:string):HeatingStep[] {
    var gid = HeatingStep.uid++;
    return [
      new HeatingStep("Begin (" + name + ")", gid),
      new HeatingStep("End (" + name + ")", gid)
    ];
  }
}

class CoolingStep implements StepImpl {
  public static uid:number = 0;

  public name:string;
  public type:StepImplType;
  public groupId:number;

  constructor(name:string, groupId:number) {
    this.type = StepImplType.cooling;
    this.name = name;
    this.groupId = groupId;
  }

  public static create(name:string):CoolingStep[] {
    var gid = CoolingStep.uid++;
    return [
      new CoolingStep("Begin (" + name + ")", gid),
      new CoolingStep("End (" + name + ")", gid)
    ];
  }
}

class FermentationStep implements StepImpl {
  public static uid:number = 0;

  public name:string;
  public type:StepImplType;
  public groupId:number;

  constructor(name:string, groupId:number) {
    this.type = StepImplType.fermenting;
    this.name = name;
    this.groupId = groupId;
  }

  public static create(name:string):FermentationStep[] {
    var gid = FermentationStep.uid++;
    return [
      new FermentationStep("Begin (" + name + ")", gid),
      new FermentationStep("End (" + name + ")", gid)
    ];
  }
}

class IngredientStep implements StepImpl {
  public name:string;
  public type:StepImplType;

  // Special Stuff
  public ingredient:string;
  public qty:string;

  constructor(name:string, ingredient:string, qty:string) {
    this.type = StepImplType.ingredient;
    this.name = name;
    this.ingredient = ingredient;
    this.qty = qty;
  }
}

class EquipmentStep implements StepImpl {
  public name:string;
  public type:StepImplType;

  // Special Stuff
  public equipment:string;

  constructor(name:string, equipment:string) {
    this.type = StepImplType.equipment;
    this.name = name;
    this.equipment = equipment;
  }
}

class MiscStep implements StepImpl {
  public name:string;
  public type:StepImplType;

  constructor(name:string) {
    this.type = StepImplType.miscellaneous;
    this.name = name;
  }
}