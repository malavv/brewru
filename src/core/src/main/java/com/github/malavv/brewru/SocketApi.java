package com.github.malavv.brewru;

import com.github.malavv.brewru.inventory.Inventory;

import javax.json.*;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Logger;

/**
 * Provides an interface for WebSocket.
 */
@ServerEndpoint("/socket")
public class SocketApi {
  private static final Logger log = Logger.getLogger(SocketApi.class.getName());
  private final Set<Session> active = new HashSet<>();

  @OnOpen
  public void onOpen(Session session) throws IOException {
    active.add(session);
  }

  @OnClose
  public void onClose(Session session) {
    if (active.contains(session))
      active.remove(session);
  }

  /**
   * Initial functionality of the router which receives basic packages.
   *
   * @param message The received message.
   */
  @OnMessage
  public void router(String message, Session session) throws IOException {
    log.info(String.format("receiving incoming transmission : %s", message));
    JsonReader reader = Json.createReader(new ByteArrayInputStream(message.getBytes()));
    JsonObject pkg = reader.readObject();

    switch (pkg.getString("type")) {
      case "SHUTDOWN":
        session.getBasicRemote().sendText("Shutting Down");
        App.shutdown();
        break;
      case "syncInventory":
        Inventory inventory = new Inventory();
        JsonObject json = Json.createObjectBuilder()
            .add("id", pkg.getInt("id"))
            .add("type", pkg.getString("type"))
            .add("data", inventory.syncMsg(inventory.sync()))
            .add("clientId", pkg.getString("clientId"))
            .build();

        session.getBasicRemote().sendText(json.toString());
        break;
    }
  }
}
