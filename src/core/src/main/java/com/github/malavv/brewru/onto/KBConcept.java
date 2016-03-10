package com.github.malavv.brewru.onto;

import com.hp.hpl.jena.rdf.model.Resource;

/** Refers to a concept in the KB. */
public class KBConcept {
  private Resource ref;

  public KBConcept(final Resource ref) { this.ref = ref; }

  public String getRef() {
    if (ref.getNameSpace().equals(Brew.getNs()))
      return Brew.getPrefix() + ref.getLocalName();
    return "unknown:" + ref.getLocalName();
  }
}
