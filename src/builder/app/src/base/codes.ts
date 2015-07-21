module base {

  /** Allows to encode a number to a different base. */
  export interface BaseConvert {
    /**
     * Converts the index to its base equivalent.
     * @param idx Number to converts
     */
    toCode(idx:number) : string;
    /**
     * Converts the code back into its associated index.
     * @param base Base to convert back.
     */
    toIdx(base:string) : number;
  }

  /**
   * Provides codes that are easily accessible from  a keyboard.
   *
   * Useful when providing keyboard shortcuts to the user.
   */
  export class KeyboardBase implements BaseConvert {
    private static codes:string = '0123456789abcdefghijklmnopqrstuvwxyz';
    private static errorCode:string = '-';
    private static errorIdx:number = -1;

    public toCode(idx:number):string {
      return KeyboardBase.isIdxValid(idx) ? KeyboardBase.codes[idx] : KeyboardBase.errorCode;
    }

    public toIdx(base:string):number {
      return KeyboardBase.isCodeValid(base) ? KeyboardBase.codes.indexOf(base) : KeyboardBase.errorIdx;
    }

    private static isIdxValid(idx:number):boolean {
      return !isNaN(idx) && !(idx < 0) || !(idx >= KeyboardBase.codes.length);
    }

    private static isCodeValid(base:string):boolean {
      return typeof (base) === 'string' && KeyboardBase.codes.indexOf(base) !== -1;
    }
  }
}
