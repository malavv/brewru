package com.github.malavv.brewru.api;

import com.github.malavv.brewru.protocol.ClientDecoder;

import javax.json.*;
import javax.websocket.Session;

public class ComputingApi {
  public static JsonStructure computeRecipe(ClientDecoder.Request r, Session s) {
    //r.data

    JsonArrayBuilder steps = Json.createArrayBuilder();

    for (int i = 0; i < 100; i++) {
      JsonObjectBuilder step = Json.createObjectBuilder();
      step.add("reac", 0);
      step.add("prop", Json.createArrayBuilder().add(1).add(23.0).add(55.0).add(5.5).build());
      step.add("sub", Json.createArrayBuilder()
          .add(1277.778)
          .add(0.009)
          .add(0.008)
          .add(0.005)
          .add(0.005)
          .add(0.005)
          .add(0.005)
          .add(0.0)
          .build());
      steps.add(step);
    }

    return Json.createObjectBuilder()
        .add("substance", Json.createArrayBuilder()
            .add("water")
            .add("calcium")
            .add("magnesium")
            .add("bicarbonate")
            .add("chlore")
            .add("sodium")
            .add("sulfate")
            .add("alphalupulin")
            .build())
        .add("reactors", Json.createArrayBuilder()
            .add("kettle")
            .build())
        .add("properties", Json.createArrayBuilder()
            .add("time")
            .add("volume")
            .add("temperature")
            .add("ph")
            .build())
        .add("steps", steps)
        .build();
  }
}
