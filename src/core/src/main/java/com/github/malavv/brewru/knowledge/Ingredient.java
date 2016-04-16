package com.github.malavv.brewru.knowledge;

import com.github.malavv.brewru.BrewruServer;
import com.github.malavv.brewru.onto.Brew;
import com.github.malavv.brewru.onto.KBConcept;
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
}
