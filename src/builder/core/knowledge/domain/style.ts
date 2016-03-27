/// <reference path="../../base/res.ts" />

class Style extends Res {
  // References
  private refCategory:string;
  private refGuide:string;

  // Name of the style
  public name:string;
  public categoryCode:string;
  public styleCode:string;

  constructor(refGuide:string = '', category:RawCategory, style:RawStyle) {
    super(style.ref);
    this.refCategory = category.ref;
    this.refGuide = refGuide;

    this.categoryCode = category.code;
    this.styleCode = style.code;

    this.name = 'unimplemented';
  }

  public toString() : string {
    return this.iri + ' - ' + this.styleCode + ' - ' + this.categoryCode;
  }
}
