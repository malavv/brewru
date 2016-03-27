package com.github.malavv.brewru;

import com.github.malavv.brewru.api.ComputingApi;
import com.github.malavv.brewru.api.KnowledgeApi;
import com.github.malavv.brewru.inventory.Inventory;
import com.github.malavv.brewru.knowledge.Equipment;
import com.github.malavv.brewru.knowledge.Style;
import com.github.malavv.brewru.knowledge.StyleGuide;
import com.github.malavv.brewru.knowledge.Unit;
import com.github.malavv.brewru.protocol.ClientDecoder;

import javax.json.*;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.*;
import java.util.function.BiFunction;
import java.util.logging.Logger;

/** Provides an interface for WebSocket. */
@ServerEndpoint(
  value = "/socket",
  decoders = ClientDecoder.class
)
public class SocketApi {
  private static final Logger log = Logger.getLogger(SocketApi.class.getName());
  private boolean isLogging;
  private final Set<Session> active = new HashSet<>();
  private final Map<String, BiFunction<ClientDecoder.Request, Session, JsonStructure>> handlers = new HashMap<>();

  public SocketApi() {
    isLogging = false;
    handlers.put("SHUTDOWN", this::shutdown);
    handlers.put("styles", KnowledgeApi::getStyles);
    handlers.put("equipments", KnowledgeApi::getEquipments);
    handlers.put("units", KnowledgeApi::getUnitSystem);
    handlers.put("compute", ComputingApi::computeRecipe);
  }

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
  public String router(ClientDecoder.Request request, Session session) throws IOException {
    if (isLogging)
      log.info(String.format("receiving incoming transmission type : %s\n", request.type));

    return Optional.ofNullable(handlers.get(request.type))
        .map(handler -> wrap(request, handler.apply(request, session)))
        .orElse(wrap(
            request,
            Json.createObjectBuilder().build(),
            singleErrorMsg("Unsupported Requested Type")));
  }

  private String wrap(ClientDecoder.Request r, JsonStructure content) {
    return wrap(r, content, Json.createArrayBuilder().build());
  }

  private String wrap(ClientDecoder.Request r, JsonStructure content, JsonArray errors) {
    return Json.createObjectBuilder()
        .add("id", r.id)
        .add("type", r.type)
        .add("data", content)
        .add("clientId", r.clientId)
        .add("errors", errors)
        .build().toString();
  }

  private JsonArray singleErrorMsg(final String msg) {
    return Json.createArrayBuilder()
        .add(Json.createObjectBuilder()
            .add("msg", msg)
            .build())
        .build();
  }

  private JsonStructure shutdown(ClientDecoder.Request r, Session s) {
    BrewruServer.t.interrupt();
    return Json.createObjectBuilder()
        .add("server", "Shutting Down")
        .build();
  }
}