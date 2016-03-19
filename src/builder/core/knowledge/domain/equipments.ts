/// <reference path="../../base/log.ts" />
/// <reference path="../../base/eventBus.ts" />
/// <reference path="equipment.ts" />

class Equipments {
  private static all : Array<Equipment> = [];
  private static equipByRef:{[ref:string]: Equipment} = {};

  /**
   * Lists all known equipment in the base KB.
   * @returns Array<Equipment> Equipment array.
   */
  public static getAll() : Array<Equipment> {
    return Equipments.all;
  }

  /**
   * Looks for a specific equipment from the KB.
   * @param ref The key to use.
   * @returns {Equipment}
   */
  public static byRef(ref:string) : Equipment {
    return Equipments.equipByRef[ref];
  }

  public static onServerLoaded(server:Server) {
    Log.info('Equipments', 'Loading Equipments');
    server.getEquipments()
        .then(Equipments.load)
        .then(bus.thenPublish(MessageType.EquipmentsLoaded));
  }

  private static load(data:Array<RawEquipment>) {
    Equipments.all = data.map((d)=> new Equipment(d));
    Equipments.all.forEach(e => Equipments.equipByRef[e.ref] = e);
    Log.info("Equipments", Object.keys(Equipments.all).length + " Equipments loaded")
  }
}
bus.suscribe(MessageType.ServerConnected, (server) => { Equipments.onServerLoaded(server); }, null);