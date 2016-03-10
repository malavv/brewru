package com.github.malavv.brewru.onto;

import com.hp.hpl.jena.rdf.model.Property;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.ResourceFactory;

public final class Brew {
  private static final String ns = "https://github.com/malavv/brewru#";
  private static final String prefix = "brewru:";

  public static String getNs() { return ns; }
  public static String getPrefix() { return prefix; }

  // Classes
  public static final Resource equipment = resource("equipment");
  public static final Resource kettle = resource("kettle");
  public static final Resource vessel = resource("vessel");
  public static final Resource style = resource("style");

  // Properties
  public static final Property hasVolumeInL = property("hasVolumeInL");
  public static final Property holdsPressure = property("holdsPressure");
  public static final Property isMultipleOf = property("isMultipleOf");

  // Internal
  private static Resource resource(String local) { return ResourceFactory.createResource(ns + local); }
  private static Property property(String local) { return ResourceFactory.createProperty(ns, local); }

  private Brew() {}
}
