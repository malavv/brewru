package com.github.malavv.brewru.onto;

import com.github.malavv.brewru.gson.ResourceJson;
import com.google.gson.annotations.JsonAdapter;
import com.hp.hpl.jena.rdf.model.Resource;

/** Refers to a concept in the KB. */
public class KBConcept {
  @JsonAdapter(ResourceJson.class)
  protected Resource ref;

  public KBConcept(final Resource ref) { this.ref = ref; }

  public String getRef() {
    if (ref.getNameSpace().equals(Brew.getNs()))
      return Brew.getPrefix() + ref.getLocalName();
    return "unknown:" + ref.getLocalName();
  }
}
