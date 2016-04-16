package com.github.malavv.brewru.reactor;

import com.github.malavv.brewru.knowledge.Equipment;
import com.github.malavv.brewru.knowledge.Ingredient;
import com.github.malavv.brewru.knowledge.Unit;
import com.github.malavv.brewru.onto.Brew;
import com.github.malavv.brewru.onto.Resolver;
import com.github.malavv.brewru.unit.Quantity;
import com.google.common.collect.Sets;

import java.util.*;
import java.util.function.BiConsumer;
import java.util.logging.Logger;
import java.util.stream.Stream;

public class BasicReactor implements Reactor {
  private final Equipment.Vessel vessel;

  private Map<Substance, Integer> substancesIdx;
  private List<Double[]> obs;

  public BasicReactor(Equipment.Vessel vessel) {
    this.vessel = vessel;
    substancesIdx = new HashMap<>();
    obs = new ArrayList<>();
  }

  @Override public Equipment.Vessel getVessel() { return vessel; }
  @Override public Stream<Substance> getSubstances() { return substancesIdx.keySet().stream(); }
  @Override public Optional<Integer> getSubstanceIdx(Substance substance) { return Optional.empty(); }
  @Override public int getLengthInMin() { return obs.size(); }
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

    // Add all ingredients to the data.
    final Set<Substance> known = substancesIdx.keySet();
    ingredient.getConstituents().stream()
        .filter(c -> !known.contains(c))
        .forEach(c -> substancesIdx.put(c, substancesIdx.keySet().size()));

    doAddition(ingredient, qty, temp);
    return this;
  }
  @Override public Double[][] getData() { return new Double[0][]; }
  @Override public double getTemperature() { return 0; }
  @Override public double getPh() { return 0; }
  @Override public double getVolume() { return 0; }

  private void doAddition(Ingredient ingredient, Quantity qty, Quantity temp) throws Exception {
    if (!hasIdxForAllSubstance(ingredient.getConstituents()))
      throw new Reactor.Exception("Does not have a substance index for all substances.");

    final Double kgOfSolvent = getKgOfSolvent(ingredient, qty, temp);
    for (Substance component : ingredient.getConstituents())
      additionOfSubstance(substancesIdx.get(component), component, getMolalityOfComponent(component) * kgOfSolvent, temp.toBase().magnitude);
  }

  private boolean hasIdxForAllSubstance(Collection<Substance> constituents) {
    return constituents.stream().allMatch(c -> substancesIdx.containsKey(c));
  }

  private double getMolalityOfComponent(Substance component) {
    Logger.getLogger("BasicReactor").warning("UNIMPLEMENTED");
    return 0.0;
  }

  private Double getKgOfSolvent(Ingredient ingredient, Quantity qty, Quantity temp) {
    Logger.getLogger("BasicReactor").warning("UNIMPLEMENTED");
    return 0.0;
  }

  private void additionOfSubstance(int idx, Substance substance, double moles, double tempInKelvin) {
    Logger.getLogger("BasicReactor").warning("UNIMPLEMENTED");
    System.out.printf("Adding %f or Substance %s at idx %d and having a temperature or %f kelvin.\n",moles,substance.getRef(),idx,tempInKelvin);
  }
}
