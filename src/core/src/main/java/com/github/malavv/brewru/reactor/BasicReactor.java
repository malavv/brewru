package com.github.malavv.brewru.reactor;

import com.github.malavv.brewru.knowledge.Equipment;
import com.github.malavv.brewru.knowledge.Ingredient;
import com.github.malavv.brewru.knowledge.Unit;
import com.github.malavv.brewru.onto.Brew;
import com.github.malavv.brewru.unit.Quantity;

import java.util.*;
import java.util.function.BiConsumer;
import java.util.logging.Logger;
import java.util.stream.Stream;

public class BasicReactor implements Reactor {
  private final Equipment.Vessel vessel;

  private Map<Substance, Integer> substancesIdx;
  private Double[][] obs;

  public BasicReactor(Equipment.Vessel vessel) {
    this.vessel = vessel;
    substancesIdx = new HashMap<>();
    obs = new Double[0][0];
  }

  @Override public Equipment.Vessel getVessel() { return vessel; }
  @Override public Stream<Substance> getSubstances() { return substancesIdx.keySet().stream(); }
  @Override public Optional<Integer> getSubstanceIdx(Substance substance) { return Optional.empty(); }
  @Override public int getLengthInMin() { return obs.length; }
  @Override
  public Reactor addition(final Ingredient ingredient, Quantity qty, Quantity temp) throws Reactor.Exception {
    if (ingredient == null || qty == null || temp == null)
      throw new Reactor.Exception("Invalid parameter to the addition");
    if (vessel == null)
      throw new Reactor.Exception("No vessel in reactor");
    if (!ingredient.canBeMeasuredIn(qty.unit.getPhysicalQuantity()))
      throw new Reactor.Exception("Invalid unit for the ingredient");
    if (!temp.unit.getPhysicalQuantity().equals(Unit.PhysicalQuantity.byRef(Brew.temperature)))
      throw new Reactor.Exception("Invalid unit for the temperature");
    doAddition(ingredient, qty, temp);
    return this;
  }
  @Override public Double[][] getData() { return new Double[0][]; }
  @Override public double getTemperature() { return 0; }
  @Override public double getPh() { return 0; }
  @Override public double getVolume() { return 0; }

  private void doAddition(Ingredient ingredient, Quantity qty, Quantity temp) {
    addSpaceForNewSubstances(ingredient.getConstituents());

    ingredient.getProportions(qty).forEach(addSubstance(temp));
  }

  private BiConsumer<Substance, Double> addSubstance(Quantity temp) {
    return (subs, qtyMoles) -> {
      Logger.getLogger("BasicReactor").info("Adding substance " + subs.getRef() + " : " + qtyMoles + " at temp : " + temp);
    };
  }

  private void addSpaceForNewSubstances(Collection<Substance> newSubstances) {
    Logger.getLogger("BasicReactor").warning("addSpaceForNewSubstances unimplemented");
  }
}
