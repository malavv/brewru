class Style {
  // References
  private ref:string;
  private refCategory:string;
  private refGuide:string;

  // Name of the style
  public name:string;
  public categoryCode:string;
  public styleCode:string;

  constructor(refGuide:string = '', category:Object, style:Object) {
    console.debug("refGuide");

    this.ref = style.ref;
    this.refCategory = category.ref;
    this.refGuide = refGuide;

    this.categoryCode = category.code;
    this.styleCode = style.code;

    this.id = 'unimplemented';
    this.name = 'unimplemented';
  }

  public toString() : string {
    return this.ref + ' - ' + this.styleCode + ' - ' + this.categoryCode;
  }
}