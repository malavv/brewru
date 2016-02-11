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