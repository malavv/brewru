package com.github.malavv.brewru.knowledge;

import com.github.malavv.brewru.onto.KBConcept;
import com.hp.hpl.jena.rdf.model.Resource;

import java.util.Optional;

public class Ingredient extends KBConcept {
  public Ingredient(Resource ref) {
    super(ref);
  }

  public static Optional<Ingredient> from(Resource resource) {
    return Optional.empty();
  }
}
