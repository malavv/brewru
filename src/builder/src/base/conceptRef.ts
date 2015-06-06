interface ConceptRef {
  isAnon: boolean;
  id: string;
  name(): string;
}

class OntoRef implements ConceptRef {
  private static nextAnonId = 0;
  private _name:string;
  id: string;
  isAnon: boolean;
  
  constructor(id:string, name:string) {
    this.id = id || 'anon:' + OntoRef.nextAnonId++;
    this._name = name;
    this.isAnon = id === null;    
  }
  
  name(): string { return this._name; }
  toString(): string { return this.name(); }
  
  static createAnon(name:string) : ConceptRef { return new OntoRef(null, name); }
  static create(id:string, name:string) : ConceptRef { return new OntoRef(id, name); }
}