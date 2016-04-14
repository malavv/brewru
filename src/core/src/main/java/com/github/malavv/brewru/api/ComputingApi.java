package com.github.malavv.brewru.api;

import com.github.malavv.brewru.BrewruServer;
import com.github.malavv.brewru.SocketApi;
import com.github.malavv.brewru.knowledge.Equipment;
import com.github.malavv.brewru.knowledge.Ingredient;
import com.github.malavv.brewru.knowledge.Unit;
import com.github.malavv.brewru.onto.Resolver;
import com.github.malavv.brewru.protocol.ComputationData;
import com.github.malavv.brewru.protocol.QtyJson;
import com.github.malavv.brewru.protocol.RecipeJson;
import com.github.malavv.brewru.protocol.StepJson;
import com.github.malavv.brewru.reactor.BasicReactor;
import com.github.malavv.brewru.reactor.Reactor;
import com.github.malavv.brewru.reactor.ReactorJson;
import com.github.malavv.brewru.unit.Quantity;
import com.google.common.collect.ImmutableMap;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.util.*;
import java.util.logging.Logger;

public class ComputingApi {
  interface ReactorFunctor<E extends StepJson> {
    void call(Reactor reactor, E step) throws ComputingException, Reactor.Exception;
  }

  private static final Map<Class<? extends StepJson>, ReactorFunctor<StepJson>> factory = ImmutableMap.of(
      StepJson.Ing.class, ComputingApi::setIng
  );

  public static class ComputingException extends Exception {
    public ComputingException(String message) { super(message); }
  }

  private static Optional<Equipment> getEquipment(final String shortForm) {
    return Resolver.fromShort(shortForm)
        .flatMap(e -> Equipment.fromKB(e, BrewruServer.getKB(), Equipment.Type.Kettle));
  }

  public static JsonElement computeRecipe(SocketApi.Pkg pkg) {
    try {
      return pkg.gson.toJsonTree(doCompute(pkg.gson.fromJson(pkg.request.data, RecipeJson.class)));
    } catch (ComputingException e) {
      Logger.getLogger("ComputingApi").severe("Computing error : " + e.getMessage());
    } catch (Reactor.Exception e) {
      Logger.getLogger("ComputingApi").severe("Reactor error : " + e.getMessage());
    }
    return new JsonObject();
  }

  public static ComputationData doCompute(RecipeJson rawRecipe) throws ComputingException, Reactor.Exception {
    if (rawRecipe.getReactors().isEmpty())
      throw new ComputingException("Recipe needs at least one reactor.");

    // Handle reactor sequentially first.
    ReactorJson raw = rawRecipe.getReactors().get(0);

    // New reactor.
    Reactor reactor = new BasicReactor();

    // Vessel
    Optional<Equipment> vessel = getEquipment(raw.getEquipment());
    if (!vessel.isPresent() || !(vessel.get() instanceof Equipment.Vessel))
      throw new ComputingException("Unknown vessel " + raw.getEquipment());
    reactor.setVessel((Equipment.Vessel) vessel.get());

    // Steps
    for (StepJson rawStep: raw.getSteps())
      factory.getOrDefault(rawStep.getClass(), ComputingApi::unknown).call(reactor, rawStep);

    return fakeData();
  }

  private static ComputationData fakeData() {
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
    return data;
  }

  public static void unknown(Reactor reactor, StepJson step) {
    Logger.getLogger("ComputingApi").severe("Unknown step class : " + step.getClass().getName());
  }

  public static void setIng(Reactor reactor, StepJson step) throws ComputingException, Reactor.Exception {
    StepJson.Ing ingStep = (StepJson.Ing) step;
    Optional<Ingredient> ingredient = Resolver.fromShort(ingStep.getIng()).flatMap(Ingredient::from);
    Optional<Quantity> quantity = resolveQuantity(ingStep.getQty());
    Optional<Quantity> temperature = resolveQuantity(ingStep.getTemp());

    if (!ingredient.isPresent()) throw new ComputingException("Invalid Ingredient " + ingStep.getIng());
    if (!quantity.isPresent()) throw new ComputingException("Invalid Quantity " + ingStep.getQty());
    if (!temperature.isPresent()) throw new ComputingException("Invalid Temperature " + ingStep.getTemp());

    reactor.addition(ingredient.get(), quantity.get(), temperature.get());
  }

  private static Optional<Quantity> resolveQuantity(QtyJson raw) {
    if (raw == null) return Optional.empty();

    return Resolver.fromShort(raw.getUnit())
        .flatMap(Unit::from)
        .map(u -> new Quantity(raw.getMagnitude(), u));
  }
}
