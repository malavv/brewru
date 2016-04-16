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

    Quantity qtyInKg = qty.unit.getPhysicalQuantity().equals(Unit.PhysicalQuantity.byRef(Brew.mass))
        ? qty : new Quantity(getKgOfSolvent(ingredient, qty, temp), Unit.from(Brew.kg).get());
    for (Substance component : ingredient.getConstituents())
      additionOfSubstance(substancesIdx.get(component), component, ingredient.getMolalityOfComponent(component) * qtyInKg.magnitude, temp.toBase().magnitude);
  }

  private boolean hasIdxForAllSubstance(Collection<Substance> constituents) {
    return constituents.stream().allMatch(c -> substancesIdx.containsKey(c));
  }

  private double getTapWaterMassInKg(double volumeInM3, double tempInKelvin) throws Exception {
    // Defined for 0 to 100 C
    int tempInC = (int)Math.floor(tempInKelvin - 273.15);
    if (tempInC <= 0 || tempInC >= 100)
      throw new Reactor.Exception("invalid range for water substance");

    return volumeInM3 * densityOfTapWaterFrom1DegCInKgPerM3[tempInC];
  }

  private double getKgOfSolvent(Ingredient ingredient, Quantity qty, Quantity temp) throws Exception {
    Logger.getLogger("BasicReactor").warning("IMPLEMENTED for tapWater only");

    if (ingredient.getRef().equals("brewru:tapwater"))
      return getTapWaterMassInKg(qty.toBase().magnitude, temp.toBase().magnitude);
    return 0.0;
  }

  private void additionOfSubstance(int idx, Substance substance, double moles, double tempInKelvin) {
    Logger.getLogger("BasicReactor").warning("UNIMPLEMENTED");
    System.out.printf("Adding %f moles of %s at idx %d and at a temperature of %f kelvin.\n",moles,substance.getRef(),idx,tempInKelvin);
  }

  private final float[] densityOfTapWaterFrom1DegCInKgPerM3 = new float[] {999.92714F,999.95912F,999.97618F,999.97856F,999.9665F,999.94024F,999.90002F,999.84608F,999.77866F,999.698F,999.60434F,999.49792F,999.37898F,999.24776F,999.1045F,998.94944F,998.78282F,998.60488F,998.41586F,998.216F,998.00554F,997.78472F,997.55378F,997.31296F,997.0625F,996.80264F,996.53362F,996.25568F,995.96906F,995.674F,995.37074F,995.05952F,994.74058F,994.41416F,994.0805F,993.73984F,993.39242F,993.03848F,992.67826F,992.312F,991.93994F,991.56232F,991.17938F,990.79136F,990.3985F,990.00104F,989.59922F,989.19328F,988.78346F,988.37F,987.95314F,987.53312F,987.11018F,986.68456F,986.2565F,985.82624F,985.39402F,984.96008F,984.52466F,984.088F,983.65034F,983.21192F,982.77298F,982.33376F,981.8945F,981.45544F,981.01682F,980.57888F,980.14186F,979.706F,979.27154F,978.83872F,978.40778F,977.97896F,977.5525F,977.12864F,976.70762F,976.28968F,975.87506F,975.464F,975.05674F,974.65352F,974.25458F,973.86016F,973.4705F,973.08584F,972.70642F,972.33248F,971.96426F,971.602F,971.24594F,970.89632F,970.55338F,970.21736F,969.8885F,969.56704F,969.25322F,968.94728F,968.64946F};
}
