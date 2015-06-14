var Polymer:Function = Polymer || function () {}

class WidgetText {
  $:any;
  isEditMode: boolean = false;
  commitedVal: string;
  
  onTap() {
      this.isEditMode = true;

      window.setTimeout(() => {
        this.$.editor.focus();
        this.$.editor.select();  
      });
      return false;
  }
  
  commitedValChanged() {
    this.isEditMode = false;    
  }
}

Polymer(WidgetText.prototype);