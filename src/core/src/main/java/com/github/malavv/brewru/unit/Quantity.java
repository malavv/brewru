package com.github.malavv.brewru.unit;

import javax.json.Json;
import javax.json.JsonObject;

public class Quantity {
  public double magnitude;
  public Unit unit;

  public JsonObject toJson() {
    return Json.createObjectBuilder()
        .add("magnitude", magnitude)
        .add("unit", unit.ref)
        .build();
  }
}
