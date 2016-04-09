package com.github.malavv.brewru.api;

import com.github.malavv.brewru.BrewruServer;
import com.github.malavv.brewru.SocketApi;
import com.github.malavv.brewru.knowledge.Equipment;
import com.github.malavv.brewru.knowledge.StyleGuide;
import com.github.malavv.brewru.knowledge.Unit;
import com.google.gson.JsonElement;

public class KnowledgeApi {
  public static JsonElement getStyles(SocketApi.Pkg pkg) {
    return pkg.gson.toJsonTree(StyleGuide.getAll(BrewruServer.getKB()));
  }

  public static JsonElement getEquipments(SocketApi.Pkg pkg) {
    return pkg.gson.toJsonTree(Equipment.getAll(BrewruServer.getKB()));
  }

  public static JsonElement getUnitSystem(SocketApi.Pkg pkg) {
    return pkg.gson.toJsonTree(Unit.getAll(BrewruServer.getKB()));
  }
}
