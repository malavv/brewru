/**
 * The Codes class contains static helper to con
 */
 interface BaseConvert {
   int2base(idx:number);
   base2int(base:string);
 }

class Codes extends BaseConvert {
  private codes:string = '0123456789abcdefghijklmnopqrstuvwxyz';
  private max:number = this.codes.length;
  private errorCode:string = '-';
  private errorIdx:number = -1;

  int2base(idx:number) {
    if (isNaN(i) || i < 0 || i >= max) return this.errorCode;
    return this.codes[i];
  }
  base2int(base:string) {
    if (typeof(c) !== 'string') return this.errorIdx;
    return this.codes.indexOf(base);
  }
}
