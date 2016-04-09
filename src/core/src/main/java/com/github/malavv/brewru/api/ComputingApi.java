package com.github.malavv.brewru.api;

import com.github.malavv.brewru.SocketApi;
import com.github.malavv.brewru.protocol.ComputationData;
import com.google.gson.JsonElement;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

public class ComputingApi {
  public static JsonElement computeRecipe(SocketApi.Pkg pkg) {
    ComputationData data = new ComputationData();
    data.substance = Arrays.asList("water", "calcium", "magnesium", "bicarbonate", "chlore", "sodium", "sulfate", "alphalupulin");
    data.reactors = Collections.singletonList("kettle");
    data.properties = Arrays.asList("time", "volume", "temperature", "ph");
    data.steps = new ArrayList<>();

    for (int i = 0; i < 100; i++) {
      ComputationData.Step step = new ComputationData.Step();
      step.reac = 0;
      step.prop = Arrays.asList(1F, 23F, 55F, 5.5F);
      step.sub = Arrays.asList(1277.778F, 0.009F, 0.008F, 0.005F, 0.005F, 0.005F, 0.005F, 0F);
      data.steps.add(step);
    }

    return pkg.gson.toJsonTree(data);
  }
}
