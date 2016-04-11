package com.github.malavv.brewru.api;

import com.github.malavv.brewru.BrewruServer;
import com.github.malavv.brewru.SocketApi;
import com.github.malavv.brewru.knowledge.Equipment;
import com.github.malavv.brewru.knowledge.Ingredient;
import com.github.malavv.brewru.knowledge.Unit;
import com.github.malavv.brewru.onto.Resolver;
import com.github.malavv.brewru.protocol.ComputationData;
import com.github.malavv.brewru.protocol.RecipeJson;
import com.github.malavv.brewru.protocol.StepJson;
import com.github.malavv.brewru.reactor.BasicReactor;
import com.github.malavv.brewru.reactor.Reactor;
import com.github.malavv.brewru.unit.Quantity;
import com.google.gson.*;
import com.hp.hpl.jena.rdf.model.Model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;
import java.util.logging.Logger;

public class ComputingApi {

  private static Optional<Equipment> getEquipment(final String shortForm) {
    return Resolver.fromShort(shortForm)
        .flatMap(e -> Equipment.fromKB(e, BrewruServer.getKB(), Equipment.Type.Kettle));
  }

  public static JsonElement computeRecipe(SocketApi.Pkg pkg) {
    RecipeJson r = pkg.gson.fromJson(pkg.request.data, RecipeJson.class);

    r.getReactors().forEach(reactorJson -> {
      Reactor reactor = new BasicReactor();

      // Vessel
      Optional<Equipment> vessel = getEquipment(reactorJson.getEquipment());
      if (!vessel.isPresent() || !(vessel.get() instanceof Equipment.Vessel)) {
        Logger.getLogger("ComputingApi").severe("Unknown Equipment: " + reactorJson.getEquipment());
        return;
      }
      reactor.setVessel((Equipment.Vessel) vessel.get());

      // Steps
      reactorJson.getSteps().forEach(step -> {
        if (step instanceof StepJson.Ing) {
          setIng(reactor, (StepJson.Ing)step);
        } else if (step instanceof StepJson.Heating) {
          System.out.println("Heating Step");
        } else {
          System.out.println("Other Step");
        }
      });

      System.out.println(reactor);
    });

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

  private static void setIng(Reactor reactor, StepJson.Ing step) {
    Optional<Ingredient> ingredient = Resolver.fromShort(step.getIng()).flatMap(Ingredient::from);
    Optional<Unit> unit = Resolver.fromShort(step.getQty().getUnit()).flatMap(Unit::from);
    if (ingredient.isPresent() && unit.isPresent())
      reactor.addition(ingredient.get(), new Quantity(step.getQty().getMagnitude(), unit.get()));
  }
}
