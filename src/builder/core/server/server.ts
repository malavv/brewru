/// <reference path="../base/eventBus.ts" />
/// <reference path="../base/log.ts" />
/// <reference path="../base/messageType.ts" />
/// <reference path="../../lib/es6-promise/es6-promise.d.ts" />

/**
 * Server proxy object which serves as an Object that could be queried from JS.
 */
interface Server {
  /** Whether a server is connected. Can be null. */
  isConnected: Boolean;

  endpoint(): string;
  syncInventory(): Promise<Object>;
  getStyles(): Promise<Object>;
  getEquipments(): Promise<Object>;
  getUnits(): Promise<Object>;

  compute(recipe: Recipe): Promise<Object>;
}

class ServerImpl {
  /** Whether a server is connected. Can be null. */
  public isConnected: Boolean = null;

  private ws: WebSocket;
  private url: string;
  private clientId: string;
  private packetIdCounter: number;
  private timeoutMs: number;
  private communications: { [id: number]: (value?: Object | Thenable<Object>) => void; };

  public endpoint(): string {
    return this.url;
  }

  public getStyles(): Promise<Object> {
    return this._req('styles');
  }

  public getEquipments(): Promise<Object> {
    return this._req('equipments');
  }

  public getUnits(): Promise<Object> {
    return this._req('units');
  }

  public compute(recipe: Recipe) : Promise<Object> {
    return this._req('compute', recipe.encode());
  }

  public syncInventory(): Promise<Object> {
    return this._req('syncInventory');
  }

  private _onMessage(msg: MessageEvent) {
    if (msg.data === 'Unsupported Requested Type') {
      Log.error('Server ', msg.data + ' ' + msg.target.url);
      return;
    }

    var response = ServerImpl.unwrap(msg.data);

    if (response == null)
      return;
    if (response.id == null) {
      Log.warn("Server", "Received Malformed Packaged." + JSON.stringify(response));
      return;
    }

    var callback = this.communications[response.id];
    if (callback == null) {
      Log.warn('Server', 'No callback for received pkg ' + response.id);
      return;
    }

    callback(response.data);
  }

  private static unwrap(json: string) : {id:string, data:Object} {
    try {
      return JSON.parse(json);
    } catch (err) {
      Log.warn('Server', 'Error parsing ' + err.message);
      return null;
    }
  }

  private _req(path : string, data? : any) : Promise<Object> {
    var
      packetId = this.packetIdCounter++,
      timeoutId,
      promise : Promise<Object> = Promise.race([
      new Promise((_, reject) => {
        timeoutId = setTimeout(reject, this.timeoutMs);
      }),
      new Promise(resolve => {
        this.communications[packetId] = resolve;
        this.ws.send(JSON.stringify({type: path, data: data, id: packetId, clientId: this.clientId}));
      })
    ]);

    return promise.then((data : Object) => {
      clearTimeout(timeoutId);
      return data;
    }).catch(err => {
      Log.error('Server', 'Received server error');
      throw err;
      return null;
    });
  }

  private _onOpen() {
    this.isConnected = true;
    bus.publish(MessageType.ServerConnected, this);
  }

  private _onClose() {
    if (this.isConnected !== null) {
      Log.warn('Server', 'Closing for unknown reasons');
      return;
    }

    bus.publish(MessageType.UnsuccessfulConnection);
  }

  private static _onError(err : any) {
    Log.warn('Server', 'Websocket error ' + JSON.stringify(err) );
  }

  constructor(endpoint: string) {
    if (endpoint === undefined)
      return;
    this.url = endpoint;
    this.packetIdCounter = 0;
    this.timeoutMs = 500;
    this.clientId = "uid00001";
    try {
      this.ws = new WebSocket(this.url);
    } catch (e) {
      Log.error("Server", JSON.stringify(e));
    }

    this.communications = {};

    this.ws.onclose = this._onClose.bind(this);
    this.ws.onerror = ServerImpl._onError.bind(this);
    this.ws.onmessage = this._onMessage.bind(this);
    this.ws.onopen = this._onOpen.bind(this);
  }
}