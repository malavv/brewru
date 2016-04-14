package com.github.malavv.brewru.reactor;

import com.github.malavv.brewru.BrewruServer;
import com.github.malavv.brewru.onto.KBConcept;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.Resource;

import java.util.Optional;

/**
 * Substance is one item that is in a mixture.
 */
public class Substance extends KBConcept {

  public Substance(Model kb, Resource resource) {
    super(resource);
  }

  public static Optional<Substance> from(Resource resource) {
    if (resource == null)
      return Optional.empty();
    return Optional.of(new Substance(BrewruServer.getKB(), resource));
  }
}
