package com.github.malavv.brewru.reactor;

import com.github.malavv.brewru.BrewruServer;
import com.github.malavv.brewru.onto.KBConcept;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.Resource;

import java.util.Optional;
import java.util.logging.Logger;

/**
 * Substance is one item that is in a mixture.
 */
public class Substance extends KBConcept {
  private double ph;
  private final double molarMassOfDistilledWater = 18.01528 / 1000;

  public Substance(Model kb, Resource resource) {
    super(resource);
  }

  public static Optional<Substance> from(Resource resource) {
    if (resource == null)
      return Optional.empty();
    return Optional.of(new Substance(BrewruServer.getKB(), resource));
  }

  @Override
  public String toString() {
    return getRef();
  }

  /**
   * Molar Heat
   * @return molar heat in joules / moles * Kelvin
   */
  public double getMolarHeat() {
    return 75.2;
  }

  public double getPh() {
    if (getRef().equals("brewru:distilledWater")) {
      Logger.getLogger("BasicReactor").warning("IMPLEMENTED for water only");
      return 7.0;
    }
    Logger.getLogger("BasicReactor").warning("UNIMPLEMENTED");
    return 0.0;
  }

  public double getVolume(double moles, double tempInKelvin) {
    return getMass(moles) / getDensity(tempInKelvin);
  }

  private double getDensity(double tempInKelvin) {
    if (getRef().equals("brewru:distilledWater")) {
      Logger.getLogger("BasicReactor").warning("IMPLEMENTED for water only(and at 4C)");
      return 1000.0;
    }
    Logger.getLogger("BasicReactor").warning("UNIMPLEMENTED");
    return 0.0;
  }

  public double getMass(double moles) {
    if (getRef().equals("brewru:distilledWater")) {
      Logger.getLogger("BasicReactor").warning("IMPLEMENTED for water only");
      return moles * molarMassOfDistilledWater;
    }
    Logger.getLogger("BasicReactor").warning("UNIMPLEMENTED");
    return 0.0;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    return getRef().equals(((Substance) o).getRef());
  }

  @Override
  public int hashCode() {
    return ref.hashCode();
  }
}
