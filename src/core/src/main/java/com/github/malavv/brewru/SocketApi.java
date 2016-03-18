package com.github.malavv.brewru;

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
  private final Set<Session> active = new HashSet<>();

  private final Map<String, BiFunction<ClientDecoder.Request, Session, String>> handlers = new HashMap<>();

  public SocketApi() {
    handlers.put("SHUTDOWN", this::shutdown);
    handlers.put("syncInventory", this::syncInventory);
    handlers.put("onto", this::onto);
    handlers.put("styles", this::getStyles);
    handlers.put("equipments", this::getEquipments);
    handlers.put("units", this::getUnitSystem);
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
    log.info(String.format("receiving incoming transmission type : %s\n", request.type));

    return Optional.ofNullable(handlers.get(request.type))
        .map(handler -> handler.apply(request, session))
        .orElse("Unsupported Requested Type");
  }

  private String shutdown(ClientDecoder.Request r, Session s) {
    BrewruServer.t.interrupt();
    return "Shutting Down";
  }

  private String syncInventory(ClientDecoder.Request r, Session s) {
    Inventory inventory = new Inventory();
    JsonObject json = Json.createObjectBuilder()
        .add("id", r.id)
        .add("type", r.type)
        .add("data", inventory.syncMsg(inventory.sync()))
        .add("clientId", r.clientId)
        .build();
    return json.toString();
  }

  private String onto(ClientDecoder.Request r, Session s) {
//    OntoProxy proxy = new OntoProxy();
//    JsonObject j = Json.createObjectBuilder()
//        .add("ontologies", proxy.ontology.getOWLOntologyManager().getOntologies().stream().map(o -> o.getOntologyID().getOntologyIRI().toString()).collect(Json::createArrayBuilder, JsonArrayBuilder::add, JsonArrayBuilder::add))
//        .add("classes", proxy.ontology.getClassesInSignature(true).stream().map(c -> c.getIRI().getRemainder().toString()).collect(Json::createArrayBuilder, JsonArrayBuilder::add, JsonArrayBuilder::add))
//        .add("individuals", proxy.ontology.getIndividualsInSignature(true).stream().map(c -> c.getIRI().getRemainder().toString()).collect(Json::createArrayBuilder, JsonArrayBuilder::add, JsonArrayBuilder::add))
//        .build();
//    return j.toString();
    return "unimplemented";
  }

  private String getStyles(ClientDecoder.Request r, Session s) {
    JsonArray allStyles = StyleGuide.listKnown(BrewruServer.getKB()).stream()
        .map(sg -> Json.createObjectBuilder()
            .add("ref", sg.getShortForm())
            .add("year", sg.getYear())
            .add("org", sg.getOrgShortForm())
            .add("styles", sg.getStyles().stream()
                .map(style -> Json.createObjectBuilder()
                    .add("ref", style.getShortForm())
                    .add("code", style.getCode())
                    .build()
                ).collect(Json::createArrayBuilder, JsonArrayBuilder::add, JsonArrayBuilder::add).build())
            .add("categories", sg.getCategory().stream()
                .map(style -> Json.createObjectBuilder()
                    .add("ref", style.getShortForm())
                    .add("code", style.getCode())
                    .add("styles", style.getStyles().stream().map(Style::getShortForm).collect(Json::createArrayBuilder, JsonArrayBuilder::add, JsonArrayBuilder::add).build())
                    .build()
                ).collect(Json::createArrayBuilder, JsonArrayBuilder::add, JsonArrayBuilder::add).build())
            .build())
        .collect(Json::createArrayBuilder, JsonArrayBuilder::add, JsonArrayBuilder::add).build();
    JsonObject json = Json.createObjectBuilder()
        .add("id", r.id)
        .add("type", r.type)
        .add("data", allStyles)
        .add("clientId", r.clientId)
        .build();
    return json.toString();
  }

  private String getEquipments(ClientDecoder.Request r, Session s) {
    JsonArray all = Equipment.getAll(BrewruServer.getKB()).stream()
        .map(sg -> {
          JsonObjectBuilder bld = Json.createObjectBuilder()
              .add("ref", sg.getRef())
              .add("type", sg.getType().toString());
          if (sg instanceof Equipment.Vessel) {
            bld.add("volumeInL", ((Equipment.Vessel) sg).getVolumeInL());
            bld.add("holdsPressure", ((Equipment.Vessel) sg).holdsPressure());
            bld.add("isMultipleOf", ((Equipment.Vessel) sg).isMultipleOf());
          }

          return bld.build();
        })
        .collect(Json::createArrayBuilder, JsonArrayBuilder::add, JsonArrayBuilder::add).build();

    JsonObject json = Json.createObjectBuilder()
        .add("id", r.id)
        .add("type", r.type)
        .add("data", all)
        .add("clientId", r.clientId)
        .build();
    return json.toString();
  }

  private String getUnitSystem(ClientDecoder.Request r, Session s) {
    JsonArray all = Unit.getAll(BrewruServer.getKB()).stream()
        .map(u -> {
          JsonObjectBuilder bld = Json.createObjectBuilder()
            .add("ref", u.getRef())
            .add("offset", u.getOffset())
            .add("multiplier", u.getMultiplier())
            .add("symbol", u.getSymbol());

          u.getBaseUnit().ifPresent(bu -> bld.add("baseUnit", bu.getRef()));

          return bld.add("physicalQuantity", u.getPhysicalQuantity().getRef())
            .add("system", u.getSystem().getRef())
            .build();
        })
        .collect(Json::createArrayBuilder, JsonArrayBuilder::add, JsonArrayBuilder::add).build();

    JsonObject json = Json.createObjectBuilder()
        .add("id", r.id)
        .add("type", r.type)
        .add("data", all)
        .add("clientId", r.clientId)
        .build();
    return json.toString();
  }
}
