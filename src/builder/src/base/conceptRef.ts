interface ConceptRef {
  isAnon: boolean;
  id: string;
  name: string;
}

class OntoRef implements ConceptRef {
  private static nextAnonId = 0;
  id: string;
  isAnon: boolean;
  name: string;
  
  constructor(id:string, name:string) {
    this.id = id || 'anon:' + OntoRef.nextAnonId++;
    this.name = name;
    this.isAnon = id === null;    
  }
  
  toString(): string { return this.name; }
  
  static createAnon(name:string) : ConceptRef { return new OntoRef(null, name); }
  static create(id:string, name:string) : ConceptRef { return new OntoRef(id, name); }
}