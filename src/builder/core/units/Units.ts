/// <reference path="../base/log.ts" />
/// <reference path="../base/eventBus.ts" />

class RawSystems {

}
class TUnit {
  public ref: string;
}

class Units {
  private static all : Array<TUnit> = [];
  private static unitByRef : {[ref : string]: TUnit} = {};

  /**
   * Lists all known units in the base KB.
   * @returns Array<Unit> Unit array.
   */
  public static getAll() : Array<TUnit> {
    return Units.all;
  }

  /**
   * Looks for a specific unit from the KB.
   * @param ref The key to use.
   * @returns {Unit}
   */
  public static byRef(ref : String) : TUnit {
    return Units.unitByRef[ref];
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
    //Units.all = data.map((d)=> new TUnit(d));
    Units.all.forEach(e => Units.unitByRef[e.ref] = e);
    Log.info("Units", "Units loaded")
  }

  private constructor() {}
}
bus.suscribe(MessageType.ServerConnected, (server) => { Units.initialize(server); }, null);