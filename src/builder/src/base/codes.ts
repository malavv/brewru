 interface BaseConvert {
   int2base(idx:number) : string;
   base2int(base:string) : number;
 }

class Codes implements BaseConvert {
  private codes:string = '0123456789abcdefghijklmnopqrstuvwxyz';
  private max:number = this.codes.length;
  private errorCode:string = '-';
  private errorIdx:number = -1;

  int2base(idx:number) {
    if (isNaN(idx) || idx < 0 || idx >= this.max) return this.errorCode;
    return this.codes[idx];
  }
  base2int(base:string) {
    if (typeof(base) !== 'string') return this.errorIdx;
    return this.codes.indexOf(base);
  }
}
