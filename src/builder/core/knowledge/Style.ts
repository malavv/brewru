class Style {
  // Internal Reference
  private id:string;

  // Name of the style
  public name:string;
  public bjcpCategory:string;
  public bjcpStyle:string;

  constructor(name:string = '', category:string = '', style:string = '') {
    this.id = 'unimplemented';
    this.name = name;
    this.bjcpCategory = category;
    this.bjcpStyle = style;
  }

  public toString() : string {
    return this.bjcpCategory + ' - ' + this.bjcpStyle + ' - ' + this.name;
  }
}