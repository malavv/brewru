package com.github.malavv.brewru;

import com.github.malavv.brewru.api.ComputingApi;
import com.github.malavv.brewru.api.KnowledgeApi;
import com.github.malavv.brewru.protocol.ClientDecoder;
import com.github.malavv.brewru.protocol.StepJson;
import com.google.gson.*;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.*;
import java.util.function.Function;
import java.util.logging.Logger;

/** Provides an interface for WebSocket. */
@ServerEndpoint(
  value = "/socket",
  decoders = ClientDecoder.class
)
public class SocketApi {
  public static class Pkg {
    public final ClientDecoder.Request request;
    public final Session session;
    public final Gson gson;

    public Pkg(ClientDecoder.Request request, Session session, Gson gson) {
      this.request = request;
      this.session = session;
      this.gson = gson;
    }
  }
  private static final Logger log = Logger.getLogger(SocketApi.class.getName());
  private boolean isLogging;
  private final Set<Session> active = new HashSet<>();
  private final Map<String, Function<Pkg, JsonElement>> handlers = new HashMap<>();

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

    Gson gson = new GsonBuilder()
        .registerTypeAdapter(StepJson.class, new StepJson.Adapter())
        .create();

    return Optional.ofNullable(handlers.get(request.type))
        .map(handler -> wrap(request, handler.apply(new Pkg(request, session, gson))))
        .orElse(wrap(
            request,
            new JsonObject(),
            singleErrorMsg("Unsupported Requested Type")));
  }

  private String wrap(ClientDecoder.Request r, JsonElement content) {
    return wrap(r, content, new JsonArray());
  }

  private String wrap(ClientDecoder.Request r, JsonElement content, JsonArray errors) {
    JsonObject json = new JsonObject();
    json.addProperty("id", r.id);
    json.addProperty("type", r.type);
    json.add("data", content);
    json.addProperty("clientId", r.clientId);
    json.add("errors", errors);
    return json.toString();
  }

  private JsonArray singleErrorMsg(final String msg) {
    JsonObject json = new JsonObject();
    json.addProperty("msg", msg);

    JsonArray arr = new JsonArray();
    arr.add(json);
    return arr;
  }

  private JsonElement shutdown(Pkg pkg) {
    BrewruServer.t.interrupt();
    JsonObject json = new JsonObject();
    json.addProperty("server", "Shutting Down");
    return json;
  }
}