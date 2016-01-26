enum StepImplType {
  equipment,
  ingredient,
  heating,
  cooling,
  fermenting,
  miscellaneous,
  unknown
}

class StepImpl {
  private static uid:number = 0;

  public id:number;
  public name:string;
  public type:StepImplType;

  constructor(name:string,
              type:StepImplType = StepImplType.unknown) {
    this.name = name;
    this.type = type;
    this.id = StepImpl.uid++;
  }
}

class GroupStep extends StepImpl {
  public next:number;

  constructor(name:string,
              type:StepImplType = StepImplType.unknown,
              next?:number) {
    super(name, StepImplType.heating);
    this.next = next;
  }
}

class HeatingStep extends GroupStep {
  constructor(name:string, next?:number) {
    super(name, StepImplType.heating, next);
  }

  public static create(name:string):HeatingStep[] {
    var
        h2 = new HeatingStep("End (" + name + ")"),
        h1 = new HeatingStep("Begin (" + name + ")", h2.id);
    return [h1, h2];
  }
}

class CoolingStep extends GroupStep {
  constructor(name:string, next?:number) {
    super(name, StepImplType.cooling, next);
  }

  public static create(name:string):CoolingStep[] {
    var
        c2 = new CoolingStep("End (" + name + ")"),
        c1 = new CoolingStep("Begin (" + name + ")", c2.id);
    return [c1, c2];
  }
}

class FermentationStep extends GroupStep {
  constructor(name:string, next?:number) {
    super(name, StepImplType.fermenting, next);
  }

  public static create(name:string):FermentationStep[] {
    var
        f2 = new FermentationStep("End (" + name + ")"),
        f1 = new FermentationStep("Begin (" + name + ")", f2.id);
    return [f1, f2];
  }
}

class IngredientStep extends StepImpl {
  public ingredient:string;
  public qty:string;

  constructor(name:string, ingredient:string, qty:string) {
    super(name, StepImplType.ingredient);
    this.ingredient = ingredient;
    this.qty = qty;
  }
}

class EquipmentStep extends StepImpl {
  public equipment:string;

  constructor(name:string) {
    super(name, StepImplType.equipment);
  }
}

class MiscStep extends StepImpl {
  constructor(name:string) {
    super(name, StepImplType.miscellaneous);
  }
}