package com.github.malavv.brewru.knowledge;

import com.github.malavv.brewru.BrewruServer;
import com.github.malavv.brewru.onto.Brew;
import com.github.malavv.brewru.onto.KBConcept;
import com.github.malavv.brewru.reactor.Substance;
import com.github.malavv.brewru.unit.Quantity;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.RDFNode;
import com.hp.hpl.jena.rdf.model.Resource;

import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Ingredient extends KBConcept {
  private Set<Unit.PhysicalQuantity> physicalQuantities;
  private Map<Substance, Double> substances;

  public Ingredient(Model kb, Resource resource) {
    super(resource);

    physicalQuantities = kb.listObjectsOfProperty(resource, Brew.measuredIn).toList().stream()
        .map(r -> Unit.PhysicalQuantity.byRef(r.asResource()))
        .collect(Collectors.toSet());

    substances = kb.listObjectsOfProperty(resource, Brew.containsSubstance).toList().stream()
        .map(RDFNode::asResource)
        .filter(node -> Substance.from(node.getPropertyResourceValue(Brew.ofSubstance)).isPresent())
        .collect(Collectors.toMap(
           node -> Substance.from(node.getPropertyResourceValue(Brew.ofSubstance)).get(),
           node -> node.getProperty(Brew.ofProportion).getDouble()
        ));
  }

  public Collection<Substance> getConstituents() { return substances.keySet(); }
  public Map<Substance, Double> getProportions() { return substances; }
  public boolean canBeMeasuredIn(Unit.PhysicalQuantity physicalQuantity) { return physicalQuantities.contains(physicalQuantity); }

  public double getQtyOfSubstance(Quantity qty) {
    Logger.getLogger("Ingredient").warning("UNIMPLEMENTED");
    return 1.7;
  }

  public static Optional<Ingredient> from(Resource resource) {
    if (resource == null)
      return Optional.empty();
    return Optional.of(new Ingredient(BrewruServer.getKB(), resource));
  }
}
