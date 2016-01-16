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
    $$: (slctr: string) => Element;
    async: (callback:()=>void, waitTime?:number) => number;
    cancelAsync: (handle:number) => void;
    fire : (type:string, detail?:Object, options?:Object) => CustomEvent;
    push: (type: string, items: Object) => void;
    set: (type: string, items: Object) => void;
  }

  interface Api {
    appendChild(node:HTMLElement) : void;
    insertBefore(node:HTMLElement, beforeNode:HTMLElement) : void;
    removeChild(node:HTMLElement) : void;
  }

  export var IronOverlayBehavior: Object;
  export var IronA11yKeysBehavior: Object;
  export var IronResizableBehavior: Object;
  export var IronMultiSelectableBehavior: Object;
  export var IronSelection: any;
  export var dom: (selector:any) => any;
}

interface Window { Polymer: any; }
window.Polymer = window.Polymer || {};