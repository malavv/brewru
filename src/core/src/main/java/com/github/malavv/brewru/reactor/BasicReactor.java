package com.github.malavv.brewru.reactor;

import com.github.malavv.brewru.knowledge.Equipment;
import com.github.malavv.brewru.knowledge.Ingredient;
import com.github.malavv.brewru.knowledge.Unit;
import com.github.malavv.brewru.onto.Brew;
import com.github.malavv.brewru.unit.Quantity;

import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Stream;

public class BasicReactor implements Reactor {
  private final Equipment.Vessel vessel;

  private Map<Substance, Integer> substancesToIdx;
  private Map<Integer, Substance> idxToSubstances;
  private List<double[]> obs;
  private List<Double> temperatureInK;
  private List<Double> ph;
  private List<Double> volumeInM3;
  private List<Double> themalInertias;
  private int now;
  private Unit kelvin;
  private final Unit cubicMetre;
  private Unit.PhysicalQuantity mass;

  public BasicReactor(Equipment.Vessel vessel, Quantity temp) {
    this.vessel = vessel;
    substancesToIdx = new HashMap<>();
    idxToSubstances = new HashMap<>();
    obs = new ArrayList<>();
    now = 0;
    temperatureInK = new ArrayList<>();
    ph = new ArrayList<>();
    volumeInM3 = new ArrayList<>();
    themalInertias = new ArrayList<>();

    temperatureInK.add(temp.toBase().magnitude);
    ph.add(Double.NaN);
    volumeInM3.add(0.0);
    themalInertias.add(vessel.getThermalInertia());

    kelvin = Unit.from(Brew.kelvin).get();
    cubicMetre = Unit.from(Brew.cubicMetre).get();
    mass = Unit.PhysicalQuantity.byRef(Brew.mass);
  }

  @Override public Equipment.Vessel getVessel() { return vessel; }
  @Override public Stream<Substance> getSubstances() { return substancesToIdx.keySet().stream(); }
  @Override public Optional<Integer> getSubstanceIdx(Substance substance) { return Optional.ofNullable(substancesToIdx.get(substance)); }
  @Override public int getNumOfMinutes() { return obs.size(); }
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
  @Override public List<double[]> getData() {
    return obs;
  }
  @Override public Quantity getTemperature(int atMinute) {
    return new Quantity(temperatureInK.get(atMinute), kelvin);
  }

  /**
   * Get the PH of the solution. (Must contain water)
   * @param atMinute The time at which you want the PH. (0 for start)
   * @return PH
   */
  @Override public double getPh(int atMinute) {
    return ph.get(atMinute);
  }

  /**
   * Get the volume of the solution. (Must contain water)
   * @param atMinute The time at which you want the volume. (0 for start)
   * @return volume
   */
  @Override public Quantity getVolume(int atMinute) {
    return new Quantity(volumeInM3.get(atMinute), cubicMetre);
  }

  private void doAddition(Ingredient ingredient, Quantity qty, Quantity temp) throws Reactor.Exception {
    registerConstituents(ingredient.getConstituents());

    addIngredient(
        getNewDataSlice(),
        ingredient,
        (qty.unit.getPhysicalQuantity().equals(mass) ? qty : ingredient.getMassFromVolume(qty, temp)).magnitude,
        temp);

    goToNextMinute();
  }

  private void registerConstituents(Collection<Substance> constituents) {
    constituents.stream()
        .filter(c -> !substancesToIdx.containsKey(c))
        .forEach(c -> {
          final int idx = substancesToIdx.keySet().size();
          substancesToIdx.put(c, idx);
          idxToSubstances.put(idx, c);
        });
  }

  private double[] getNewDataSlice() {
    double[] data = new double[substancesToIdx.keySet().size()];
    obs.add(data);
    return data;
  }

  private void goToNextMinute() {
    now += 1;
  }

  private void addIngredient(double[] data, Ingredient ingredient, double massInKg, Quantity temp) throws Exception {
    // Initially I though that first ingredient addition must contain water, but for mash this is not true.

    // Adjust temperature
    adjustReactorTemperature(ingredient, massInKg, temp);

    // Adjust PH
    adjustReactorPh(ingredient);

    // Adjust volume
    adjustReactorVolume(ingredient, massInKg, temp);

    // Add moles at the end
    for (Substance subs : ingredient.getConstituents())
      data[substancesToIdx.get(subs)] = ingredient.getMolalityOfComponent(subs) * massInKg;
  }

  private void adjustReactorTemperature(Ingredient ingredient, double massInKg, Quantity temp) {
    double ingSpecHeat = ingredient.getSpecificHeat();
    double inertia1 = massInKg * ingSpecHeat;
    double inertia2 = themalInertias.get(now);

    double ingTempInK = temp.toBase().magnitude;
    double reactorTempInK = getTemperature(now).toBase().magnitude;

    double totalThermalEnergy = ingTempInK * inertia1 + reactorTempInK * inertia2;
    double totalThermalInertia = inertia1 + inertia2;

    temperatureInK.add(totalThermalEnergy / totalThermalInertia);
    themalInertias.add(totalThermalInertia);
  }

  private void adjustReactorPh(Ingredient ingredient) {
    if (ph.get(now).isNaN())
      ph.add(ingredient.getPh());
    Logger.getLogger("BasicReactor").warning("UNIMPLEMENTED");
  }

  private void adjustReactorVolume(Ingredient ingredient, double massInKg, Quantity temp) throws Exception {
    Logger.getLogger("BasicReactor").warning("UNIMPLEMENTED");
    volumeInM3.add(massInKg / ingredient.getDensity(temp));
  }
}
