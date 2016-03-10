/// <reference path="../../base/log.ts" />
/// <reference path="../../base/eventBus.ts" />
/// <reference path="equipment.ts" />

class Equipments {
  private static all : Array<Equipment> = [];
  private static allByRef : {[ref:string]: Style} = {};

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
  public static byRef(ref:String) : Equipment {
    return Equipments.allByRef[ref];
  }

  public static onServerLoaded(server:Server) {
    Log.info('Styles', 'Loading Equipments');
    server.getEquipments().then(Equipments.load).then(bus.thenPublish(MessageType.EquipmentsLoaded));
  }

  private static load(data: Object) {
    console.log('loaded', data);
  }
  private constructor() {}
}
bus.suscribe(MessageType.ServerConnected, (server) => { Equipments.onServerLoaded(server); }, null);