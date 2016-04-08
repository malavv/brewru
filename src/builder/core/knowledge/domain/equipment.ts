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
    this.holdsPressure = false;
    this.isMultipleOf = false;
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }

  public getType() : string { return this.type || ''; }
  public getVolumeInL() : number { return this.volumeInL || -1; }
}