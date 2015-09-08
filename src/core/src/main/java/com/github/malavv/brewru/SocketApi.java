package com.github.malavv.brewru;

import com.github.malavv.brewru.inventory.Inventory;
import com.github.malavv.brewru.onto.OntoProxy;
import com.hp.hpl.jena.ontology.OntDocumentManager;
import com.hp.hpl.jena.ontology.OntProperty;
import com.hp.hpl.jena.rdf.model.Resource;

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

    if (!pkg.containsKey("type")) {
      log.warning("Malformed payload.");
      return;
    }


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
      case "onto":
        OntoProxy proxy = new OntoProxy();
        JsonObject j = Json.createObjectBuilder()
            .add("ontologies", proxy.m.listOntologies().toList().stream().map(Resource::toString).collect(Json::createArrayBuilder, JsonArrayBuilder::add, JsonArrayBuilder::add))
            .add("classes", proxy.m.listClasses().toList().stream().map(Resource::toString).collect(Json::createArrayBuilder, JsonArrayBuilder::add, JsonArrayBuilder::add))
            .add("individuals", proxy.m.listIndividuals().toList().stream().map(Resource::toString).collect(Json::createArrayBuilder, JsonArrayBuilder::add, JsonArrayBuilder::add))
            .add("statements", proxy.m.listStatements().toList().stream().map(Object::toString).collect(Json::createArrayBuilder, JsonArrayBuilder::add, JsonArrayBuilder::add))
            .build();
        session.getBasicRemote().sendText(j.toString());
        break;
    }
  }
}
