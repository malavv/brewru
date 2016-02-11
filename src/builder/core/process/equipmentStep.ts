/// <reference path="StepImpl.ts" />
/// <reference path="../knowledge/domain/equipment.ts" />

class EquipmentStep extends StepImpl {
  public equipment:Equipment;

  constructor(equipment: Equipment) {
    super(equipment.name, StepImplType.equipment);
    this.equipment = equipment;
  }
}