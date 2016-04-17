package com.github.malavv.brewru.knowledge;

import com.github.malavv.brewru.BrewruServer;
import com.github.malavv.brewru.onto.Brew;
import com.github.malavv.brewru.onto.KBConcept;
import com.github.malavv.brewru.reactor.Reactor;
import com.github.malavv.brewru.reactor.Substance;
import com.github.malavv.brewru.unit.Quantity;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Maps;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.RDFNode;
import com.hp.hpl.jena.rdf.model.Resource;

import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * An ingredient is a set of substance composing a logical element.
 *
 * Ingredient are components of a recipe, and are made of substances.
 * (ex. Tap Water is made of distilled water, calcium, chlorine, ...)
 */
public class Ingredient extends KBConcept {
  /** Accepted physicial  */
  private Set<Unit.PhysicalQuantity> physicalQuantities;
  private Map<Substance, Double> substances;
  private final double molarMassOfWaterInKgPerMole = 0.01801528;
  private Unit.PhysicalQuantity mass;
  private Unit.PhysicalQuantity volumeQty;
  private double specificHeat;

  public Ingredient(Model kb, Resource resource) {
    super(resource);

    physicalQuantities = kb.listObjectsOfProperty(resource, Brew.measuredIn)
        .mapWith(RDFNode::asResource).mapWith(Unit.PhysicalQuantity::byRef).toSet();

    substances = kb.listObjectsOfProperty(resource, Brew.containsSubstance).toList().stream()
        .map(RDFNode::asResource).map(n -> Maps.immutableEntry(
            Substance.from(n.getPropertyResourceValue(Brew.ofSubstance)),
            n.getProperty(Brew.ofProportion).getDouble()
        ))
        .filter(e -> e.getKey().isPresent())
        .collect(Collectors.toMap(e -> e.getKey().get(), Map.Entry::getValue));
    if (mass == null) mass = Unit.PhysicalQuantity.byRef(Brew.mass);
    if (volumeQty == null) volumeQty = Unit.PhysicalQuantity.byRef(Brew.volume);
  }

  public Collection<Substance> getConstituents() { return substances.keySet(); }
  public Map<Substance, Double> getProportions(Quantity qty) { return substances; }
  public boolean canBeMeasuredIn(Unit.PhysicalQuantity physicalQuantity) { return physicalQuantities.contains(physicalQuantity); }

  public static Optional<Ingredient> from(Resource resource) {
    if (resource == null)
      return Optional.empty();
    if (!BrewruServer.getKB().containsResource(resource))
      return Optional.empty();

    return Optional.of(new Ingredient(BrewruServer.getKB(), resource));
  }

  public double getMolalityOfComponent(Substance component) {
    Logger.getLogger("Ingredient").warning("IMPLEMENTED for tapwater only");
    if (getRef().equals("brewru:tapwater")) {
      if (component.getRef().equals("brewru:distilledWater")) {
        return 1 / molarMassOfWaterInKgPerMole;
      }
    }
    return 0.0;
  }

  public double getDensity(Quantity temp) throws Reactor.Exception {
    Logger.getLogger("Ingredient").warning("IMPLEMENTED for tapwater only");
    if (getRef().equals("brewru:tapwater")) {
      // Defined for 0 to 100 C
      int tempInC = (int)Math.floor(temp.toBase().magnitude - 273.15);
      if (tempInC <= 0 || tempInC >= 100)
        throw new Reactor.Exception("invalid range for water substance");
      return densityOfTapWaterFrom1DegCInKgPerM3[tempInC];
    }
    return 0.0;
  }

  public Quantity getMassFromVolume(Quantity volume, Quantity temp) throws Reactor.Exception {
    if (volume.unit.getPhysicalQuantity().equals(mass))
      return volume.toBase();
    if (!volume.unit.getPhysicalQuantity().equals(volumeQty))
      throw new Reactor.Exception("Unable to get mass from this physical quantity " + volume.unit.getPhysicalQuantity().getRef());

    return new Quantity(volume.toBase().magnitude * getDensity(temp), Unit.from(Brew.kg).get());
  }

  private final float[] densityOfTapWaterFrom1DegCInKgPerM3 = new float[] {999.92714F,999.95912F,999.97618F,999.97856F,999.9665F,999.94024F,999.90002F,999.84608F,999.77866F,999.698F,999.60434F,999.49792F,999.37898F,999.24776F,999.1045F,998.94944F,998.78282F,998.60488F,998.41586F,998.216F,998.00554F,997.78472F,997.55378F,997.31296F,997.0625F,996.80264F,996.53362F,996.25568F,995.96906F,995.674F,995.37074F,995.05952F,994.74058F,994.41416F,994.0805F,993.73984F,993.39242F,993.03848F,992.67826F,992.312F,991.93994F,991.56232F,991.17938F,990.79136F,990.3985F,990.00104F,989.59922F,989.19328F,988.78346F,988.37F,987.95314F,987.53312F,987.11018F,986.68456F,986.2565F,985.82624F,985.39402F,984.96008F,984.52466F,984.088F,983.65034F,983.21192F,982.77298F,982.33376F,981.8945F,981.45544F,981.01682F,980.57888F,980.14186F,979.706F,979.27154F,978.83872F,978.40778F,977.97896F,977.5525F,977.12864F,976.70762F,976.28968F,975.87506F,975.464F,975.05674F,974.65352F,974.25458F,973.86016F,973.4705F,973.08584F,972.70642F,972.33248F,971.96426F,971.602F,971.24594F,970.89632F,970.55338F,970.21736F,969.8885F,969.56704F,969.25322F,968.94728F,968.64946F};

  public double getSpecificHeat() {
    if (getRef().equals("brewru:tapwater")) {
      return 4185.5;
    }
    Logger.getLogger("Ingredient").warning("UNIMPLEMENTED");
    return 0.0;
  }

  public Double getPh() {
    if (getRef().equals("brewru:tapwater")) {
      return 7.5;
    }
    Logger.getLogger("Ingredient").warning("UNIMPLEMENTED");
    return 0.0;
  }
}
