package com.github.malavv.brewru.api;

import com.github.malavv.brewru.BrewruServer;
import com.github.malavv.brewru.knowledge.Equipment;
import com.github.malavv.brewru.knowledge.Style;
import com.github.malavv.brewru.knowledge.StyleGuide;
import com.github.malavv.brewru.knowledge.Unit;
import com.github.malavv.brewru.protocol.ClientDecoder;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;
import javax.json.JsonStructure;
import javax.websocket.Session;

public class KnowledgeApi {
  public static JsonStructure getStyles(ClientDecoder.Request r, Session s) {
    return StyleGuide.listKnown(BrewruServer.getKB()).stream()
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
  }

  public static JsonStructure getEquipments(ClientDecoder.Request r, Session s) {
    return Equipment.getAll(BrewruServer.getKB()).stream()
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
  }

  public static JsonStructure getUnitSystem(ClientDecoder.Request r, Session s) {
    return Unit.getAll(BrewruServer.getKB()).stream()
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
  }
}
