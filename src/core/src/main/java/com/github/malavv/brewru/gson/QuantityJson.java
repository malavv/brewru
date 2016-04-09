package com.github.malavv.brewru.gson;

import com.github.malavv.brewru.unit.Quantity;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

import java.lang.reflect.Type;

public class QuantityJson implements JsonSerializer<Quantity> {
  @Override
  public JsonElement serialize(Quantity src, Type typeOfSrc, JsonSerializationContext context) {
    JsonObject json = new JsonObject();
    json.addProperty("magnitude", src.magnitude);
    json.addProperty("unit", src.unit.ref);
    return json;
  }
}
