package com.github.malavv.brewru.protocol;

import com.google.gson.*;

import java.util.ArrayList;
import java.util.List;

public interface StepJson {
  enum Type {
    equipment,
    ingredient,
    heating,
    cooling,
    fermenting,
    miscellaneous,
    processTarget,
    unknown
  }

  class Ing implements StepJson {
    private String ing;
    private QtyJson qty;
    private QtyJson temp;

    public String getIng() { return ing; }
    public QtyJson getQty() { return qty; }
    public QtyJson getTemp() { return temp; }
  }

  class Heating implements StepJson {
    private List<JsonObject> targets;
  }

  class Adapter implements JsonDeserializer<StepJson> {
    private StepJson ing(JsonElement json, JsonDeserializationContext c) {
      Ing i = new Ing();
      i.ing = json.getAsJsonObject().get("ing").getAsString();
      i.qty = c.deserialize(json.getAsJsonObject().get("qty"), QtyJson.class);
      i.temp = c.deserialize(json.getAsJsonObject().get("temp"), QtyJson.class);
      return i;
    }
    private StepJson heating(JsonElement json, JsonDeserializationContext c) {
      Heating i = new Heating();
      i.targets = new ArrayList<>();

      json.getAsJsonObject().get("targets").getAsJsonArray()
          .forEach(t -> i.targets.add(t.getAsJsonObject()));
      return i;
    }

    @Override public StepJson deserialize(JsonElement json, java.lang.reflect.Type t, JsonDeserializationContext c) throws JsonParseException {
      int type = json.getAsJsonObject().get("type").getAsInt();
      switch (Type.values()[type]) {
        case equipment:
          break;
        case ingredient:
          return ing(json, c);
        case heating:
          return heating(json, c);
        case cooling:
          break;
        case fermenting:
          break;
        case miscellaneous:
          break;
        case processTarget:
          break;
        case unknown:
          break;
      }
      return c.deserialize(json, t);
    }
  }
}
