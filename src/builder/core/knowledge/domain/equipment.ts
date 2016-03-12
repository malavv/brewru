interface RawEquipment {
  holdsPressure: boolean;
  isMultipleOf: boolean;
  ref: string;
  type: string;
  volumeInL: number;
}

class Equipment {
  public ref:string;
  private holdsPressure:boolean;
  private isMultipleOf:boolean;
  private type:string;
  private volumeInL:number;

  constructor(data:RawEquipment) {
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }
}