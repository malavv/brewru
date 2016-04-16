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
  private int now;

  public BasicReactor(Equipment.Vessel vessel, Quantity temp) {
    this.vessel = vessel;
    substancesToIdx = new HashMap<>();
    idxToSubstances = new HashMap<>();
    obs = new ArrayList<>();
    now = 0;
    temperatureInK = new ArrayList<>();
    ph = new ArrayList<>();
    volumeInM3 = new ArrayList<>();

    temperatureInK.add(temp.toBase().magnitude);
    ph.add(7.0);
    volumeInM3.add(0.0);
  }

  @Override public Equipment.Vessel getVessel() { return vessel; }
  @Override public Stream<Substance> getSubstances() { return substancesToIdx.keySet().stream(); }
  @Override public Optional<Integer> getSubstanceIdx(Substance substance) {
    return Optional.ofNullable(substancesToIdx.get(substance));
  }
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
    final Set<Substance> known = substancesToIdx.keySet();
    ingredient.getConstituents().stream()
        .filter(c -> !known.contains(c))
        .forEach(c -> {
          int idx = substancesToIdx.keySet().size();
          substancesToIdx.put(c, idx);
          idxToSubstances.put(idx, c);
        });

    doAddition(ingredient, qty, temp);
    return this;
  }
  @Override public List<double[]> getData() {
    return obs;
  }
  @Override public Quantity getTemperature(int atMinute) {
    return new Quantity(temperatureInK.get(atMinute), Unit.from(Brew.kelvin).get());
  }
  @Override public double getPh(int atMinute) {
    return ph.get(atMinute);
  }
  @Override public Quantity getVolume(int atMinute) {
    return new Quantity(volumeInM3.get(atMinute), Unit.from(Brew.cubicMetre).get());
  }

  private void doAddition(Ingredient ingredient, Quantity qty, Quantity temp) throws Exception {
    if (!hasIdxForAllSubstance(ingredient.getConstituents()))
      throw new Reactor.Exception("Does not have a substance index for all substances.");

    // Create new obs array;
    double[] substanceQty = new double[substancesToIdx.keySet().size()];
    obs.add(substanceQty);

    Quantity qtyInKg = qty.unit.getPhysicalQuantity().equals(Unit.PhysicalQuantity.byRef(Brew.mass))
        ? qty : new Quantity(getKgOfSolvent(ingredient, qty, temp), Unit.from(Brew.kg).get());
    for (Substance component : ingredient.getConstituents())
      additionOfSubstance(substancesToIdx.get(component), component, ingredient.getMolalityOfComponent(component) * qtyInKg.magnitude, temp.toBase().magnitude);
    now += 1;
  }

  private boolean hasIdxForAllSubstance(Collection<Substance> constituents) {
    return constituents.stream().allMatch(c -> substancesToIdx.containsKey(c));
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
    Logger.getLogger("BasicReactor").warning("UNIMPLEMENTED for other then first Item.");
    System.out.printf("Adding %f moles of %s at idx %d and at a temperature of %f kelvin.\n", moles, substance.getRef(), idx, tempInKelvin);
    double adjustedTemperature = deltaTemperature(substance, moles, tempInKelvin);
    double adjustedPh = deltaPh(substance, moles, tempInKelvin);
    double deltaVolumeInM3 = deltaVolume(substance, moles, tempInKelvin);

    // adding new stuff.
    obs.get(now)[substancesToIdx.get(substance)] = moles;

    if (temperatureInK.get(now) == null) temperatureInK.add(0.0);
    if (ph.get(now) == null) ph.add(0.0);
    if (volumeInM3.get(now) == null) volumeInM3.add(0.0);

    temperatureInK.set(now, getTemperature(now).magnitude + adjustedTemperature);
    ph.set(now, getPh(now) + adjustedPh);
    volumeInM3.set(now, getVolume(now).magnitude + deltaVolumeInM3);

    // All set?
    System.out.printf("Temp incr. by %f kelvin, its PH by %f, its volume by %f.\n", adjustedTemperature, adjustedPh, deltaVolumeInM3);
  }

  private double deltaVolume(Substance substance, double moles, double tempInKelvin) {
    return substance.getVolume(moles, tempInKelvin);
  }

  private double deltaPh(Substance substance, double moles, double tempInKelvin) {
    if (obs.isEmpty())
      return substance.getPh() - getPh(now - 1);
    Logger.getLogger("BasicReactor").warning("UNIMPLEMENTED");
    return 0;
  }

  private double deltaTemperature(Substance substance, double moles, double tempInKelvin) {
    List<Double> temperatures = new ArrayList<>();
    List<Double> thermalInertia = new ArrayList<>();
    double currentTempInKelvin = getTemperature(now).magnitude;

    // Add Vessel;
    temperatures.add(currentTempInKelvin);
    thermalInertia.add(vessel.getThermalInertia());

    // Add All previous component
    if (!obs.isEmpty()) {
      for (int i = 0; i < obs.get(now).length; i++) {
        temperatures.add(currentTempInKelvin);
        thermalInertia.add(obs.get(now)[i] * idxToSubstances.get(i).getMolarHeat());
      }
    }

    // Add new component
    temperatures.add(tempInKelvin);
    thermalInertia.add(moles * substance.getMolarHeat());

    double totalThermalEnergy = 0.0;
    double totalThermalInertia = 0.0;

    for (int i = 0; i < thermalInertia.size(); i++) {
      totalThermalEnergy += thermalInertia.get(i) * temperatures.get(i);
      totalThermalInertia += thermalInertia.get(i);
    }

    return (totalThermalEnergy / totalThermalInertia) - currentTempInKelvin;
  }

  private final float[] densityOfTapWaterFrom1DegCInKgPerM3 = new float[] {999.92714F,999.95912F,999.97618F,999.97856F,999.9665F,999.94024F,999.90002F,999.84608F,999.77866F,999.698F,999.60434F,999.49792F,999.37898F,999.24776F,999.1045F,998.94944F,998.78282F,998.60488F,998.41586F,998.216F,998.00554F,997.78472F,997.55378F,997.31296F,997.0625F,996.80264F,996.53362F,996.25568F,995.96906F,995.674F,995.37074F,995.05952F,994.74058F,994.41416F,994.0805F,993.73984F,993.39242F,993.03848F,992.67826F,992.312F,991.93994F,991.56232F,991.17938F,990.79136F,990.3985F,990.00104F,989.59922F,989.19328F,988.78346F,988.37F,987.95314F,987.53312F,987.11018F,986.68456F,986.2565F,985.82624F,985.39402F,984.96008F,984.52466F,984.088F,983.65034F,983.21192F,982.77298F,982.33376F,981.8945F,981.45544F,981.01682F,980.57888F,980.14186F,979.706F,979.27154F,978.83872F,978.40778F,977.97896F,977.5525F,977.12864F,976.70762F,976.28968F,975.87506F,975.464F,975.05674F,974.65352F,974.25458F,973.86016F,973.4705F,973.08584F,972.70642F,972.33248F,971.96426F,971.602F,971.24594F,970.89632F,970.55338F,970.21736F,969.8885F,969.56704F,969.25322F,968.94728F,968.64946F};
}
