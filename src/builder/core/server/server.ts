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
    var packet = {
      type: 'styles',
      data: <Object>null,
      id: this.packetIdCounter,
      clientId: this.clientId
    };

    var promise = new Promise((resolve) => {
      this.communications[this.packetIdCounter] = resolve;
    });

    this.packetIdCounter++;
    console.info('server.send', packet);
    this.ws.send(JSON.stringify(packet));

    return Promise.race([
      new Promise((_, reject) => { setTimeout(reject, this.timeoutMs); }),
      promise
    ]).then((data) => {
      return data;
    }).catch((error) => {
      throw error;
      return null;
    });
  }

  public getEquipments(): Promise<Object> {
    var packet = {
      type: 'equipments',
      data: <Object>null,
      id: this.packetIdCounter,
      clientId: this.clientId
    };

    var promise = new Promise((resolve) => {
      this.communications[this.packetIdCounter] = resolve;
    });

    this.packetIdCounter++;
    console.info('server.send', packet);
    this.ws.send(JSON.stringify(packet));

    return Promise.race([
      new Promise((_, reject) => { setTimeout(reject, this.timeoutMs); }),
      promise
    ]).then((data) => {
      return data;
    }).catch((error) => {
      throw error;
      return null;
    });
  }

  public syncInventory(): Promise<Object> {
    var packet = {
      type: 'syncInventory',
      data: <Object>null,
      id: this.packetIdCounter,
      clientId: this.clientId
    };

    var promise = new Promise((resolve) => {
      this.communications[this.packetIdCounter] = resolve;
    });

    this.packetIdCounter++;
    console.info('server.send', packet);
    this.ws.send(JSON.stringify(packet));

    return Promise.race([
      new Promise((_, reject) => { setTimeout(reject, this.timeoutMs); }),
      promise
    ]).then((data) => {
      return data;
    }).catch((error) => {
      throw error;
      return null;
    });
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
    this.ws.onerror = this._onError.bind(this);
    this.ws.onmessage = this._onMessage.bind(this);
    this.ws.onopen = this._onOpen.bind(this);
  }

  private _onClose() {
    if (this.isConnected === null)
      bus.publish(MessageType.UnsuccessfulConnection);
  }

  private _onError() {

  }

  private _onMessage(msg: MessageEvent) {
    try {
      var pkg = JSON.parse(msg.data);
      console.info('server.received', pkg)
      if (pkg.id == null)
        Log.warn("Server", "Received Malformed Packaged." + JSON.stringify(pkg));
      var callback = this.communications[pkg.id];
      if (callback !== undefined) {
        callback(pkg.data);
      }
    } catch (err) {
      console.warn('Error parsing ' + err.message);
    }
  }

  private _onOpen() {
    this.isConnected = true;
    bus.publish(MessageType.ServerConnected, this);
  }
}