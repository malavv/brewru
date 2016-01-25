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
  private id: string;
  public name: string;

  public type: StepImplType;

  constructor(type: StepImplType = StepImplType.unknown, name: string) {
    this.type = type;
    this.name = name;
  }
}