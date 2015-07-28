interface ConceptRef {
  isAnon: boolean;
  ref: string;
  name: string;
}

class OntoRef implements ConceptRef {
  private static nextAnonRef = 0;
  ref: string;
  isAnon: boolean;
  name: string;
  
  constructor(ref:string, name:string) {
    this.ref = ref || 'anon:' + OntoRef.nextAnonRef++;
    this.name = name;
    this.isAnon = ref === null;    
  }
  
  toString(): string { return this.name; }
  
  static createAnon(name:string) : ConceptRef { return new OntoRef(null, name); }
  static create(ref:string, name:string) : ConceptRef { return new OntoRef(ref, name); }
}