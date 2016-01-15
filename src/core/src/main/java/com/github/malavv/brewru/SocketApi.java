package com.github.malavv.brewru;

import com.github.malavv.brewru.inventory.Inventory;
import com.github.malavv.brewru.onto.OntoProxy;
import com.github.malavv.brewru.protocol.ClientDecoder;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Logger;

/**
 * Provides an interface for WebSocket.
 */
@ServerEndpoint(
  value = "/socket",
  decoders = ClientDecoder.class
)
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
   * @param request The received message.
   * @param session Session from the client.
   */
  @OnMessage
  public void router(ClientDecoder.Request request, Session session) throws IOException {
    log.info(String.format("receiving incoming transmission : %s", request));


    switch (request.type) {
      case "SHUTDOWN":
        session.getBasicRemote().sendText("Shutting Down");
        BrewruServer.t.interrupt();
        break;
      case "syncInventory":
        Inventory inventory = new Inventory();
        JsonObject json = Json.createObjectBuilder()
            .add("id", request.id)
            .add("type", request.type)
            .add("data", inventory.syncMsg(inventory.sync()))
            .add("clientId", request.clientId)
            .build();
        session.getBasicRemote().sendText(json.toString());
        break;
      case "onto":
        OntoProxy proxy = new OntoProxy();
        JsonObject j = Json.createObjectBuilder()
            .add("ontologies", proxy.ontology.getOWLOntologyManager().getOntologies().stream().map(o -> o.getOntologyID().getOntologyIRI().toString()).collect(Json::createArrayBuilder, JsonArrayBuilder::add, JsonArrayBuilder::add))
            .add("classes", proxy.ontology.getClassesInSignature(true).stream().map(c -> c.getIRI().getRemainder().toString()).collect(Json::createArrayBuilder, JsonArrayBuilder::add, JsonArrayBuilder::add))
            .add("individuals", proxy.ontology.getIndividualsInSignature(true).stream().map(c -> c.getIRI().getRemainder().toString()).collect(Json::createArrayBuilder, JsonArrayBuilder::add, JsonArrayBuilder::add))
            .build();
        session.getBasicRemote().sendText(j.toString());
        break;
    }
  }
}
