/// <reference path="../base/log.ts" />
/// <reference path="../base/eventBus.ts" />
/// <reference path="../server/server.ts" />

class PhysQty {
  private static known : {[ref : string]: PhysQty} = {};
  private ref : string;
  
  public static all() : Array<PhysQty> {
    return Object.keys(PhysQty.known).map(k => PhysQty.known[k]);
  }
  
  public static byRef(ref : string) : PhysQty {
    if (PhysQty.known[ref] == null)
      PhysQty.known[ref] = new PhysQty(ref);
    return PhysQty.known[ref];
  }
  
  constructor(ref : string) {
    this.ref = ref;
  }
}

class UnitSys {
  private static known : {[ref : string]: UnitSys} = {};
  private ref : string;
  
  public static all() : Array<UnitSys> {
    return Object.keys(UnitSys.known).map(k => UnitSys.known[k]);
  }
  
  public static byRef(ref : string) : UnitSys {
    if (UnitSys.known[ref] == null)
      UnitSys.known[ref] = new UnitSys(ref);
    return UnitSys.known[ref];
  }
  
  constructor(ref : string) {
    this.ref = ref;
  }
}

class RawUnit {
  public baseUnit: string;
  public multiplier: number;
  public offset: number;
  public physicalQuantity: string;
  public ref: string;
  public symbol: string;
  public system: string;
}
class TUnit {
  private baseUnit: string;
  private multiplier: number;
  private offset: number;
  private physicalQuantity: PhysQty;
  private ref: string;
  private symbol: string;
  private system: UnitSys;
  
  public getBaseUnit() : TUnit { return Units.byRef(this.baseUnit); }
  public getSymbol() : string { return this.symbol; }
  
  constructor(base: string, mult: number, offset: number, physQty: PhysQty, ref: string, sym: string, system: UnitSys) {
    this.baseUnit = base;
    this.multiplier = mult; 
    this.offset = offset;
    this.physicalQuantity = physQty;
    this.ref = ref;
    this.symbol = sym;
    this.system = system;
  }
}

class Units {
  private static known : {[ref : string]: TUnit} = {};

  /**
   * Lists all known units in the base KB.
   * @returns Array<Unit> Unit array.
   */
  public static getAll() : Array<TUnit> {
    return Object.keys(Units.known).map(k => Units.known[k]);
  }

  /**
   * Looks for a specific unit from the KB.
   * @param ref The key to use.
   * @returns {Unit}
   */
  public static byRef(ref : string) : TUnit {
    return Units.known[ref];
  }
  
  /**
   * Retrieves a unit based on its symbol. ex: min
   */
  public static bySymbol(symbol : string) : TUnit {
    var found = Units.getAll().filter(u => u.getSymbol() === symbol);
    if (found.length == 0)
      Log.warn('Units', 'Did not find unit for symbol ' + symbol);
    return found[0];
  }

  /**
   * Initializes the units systems from the server's KB.
   * @param server Server Proxy.
   */
  public static initialize(server : Server) {
    Log.info('Units', 'Initializing Units');
    server.getUnits()
        .then(Units.load)
        .then(bus.thenPublish(MessageType.UnitsLoaded));
  }

  private static load(data : Array<RawUnit>) {
    data.forEach(raw => {
      Units.known[raw.ref] = new TUnit(raw.baseUnit, raw.multiplier, raw.offset,
           PhysQty.byRef(raw.physicalQuantity), raw.ref, raw.symbol, UnitSys.byRef(raw.system));
    })
    
    Log.info("Units", Units.getAll().length + " Units loaded")
  }
}

/** Helper function to make it smaller since it will be used often. */
var SU = Units.bySymbol;
bus.suscribe(MessageType.ServerConnected, (server) => { Units.initialize(server); }, null);