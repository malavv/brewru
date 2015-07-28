/**
 * Homemade definition class for a Polymer Element.
 */
module Polymer {
  export class DomModule {
    // Properties
    is: string;
    behaviors: any[];
    properties: {[key:string]: Object};
    listeners: {[key:string]: string};
    root: Element;
    $:any;
    // Methods
    $$: (selector: string) => Element;
    async: (callback:()=>void, waitTime:number) => void;
  }

  export var IronOverlayBehavior: Object;
  export var IronResizableBehavior: Object;
  export var IronMultiSelectableBehavior: Object;
  export var IronSelection: any;
  export var dom: (any) => any;
}

interface Window { Polymer: any; }
window.Polymer = window.Polymer || {};