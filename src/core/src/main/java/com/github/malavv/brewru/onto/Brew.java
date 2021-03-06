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
  public static final Resource unit = resource("unit");
  public static final Resource systemOfUnits = resource("systemOfUnits");
  public static final Resource physicalQuantity = resource("physicalQuantity");
  public static final Resource styleGuide = resource("styleGuide");
  public static final Resource temperature = resource("thermodynamicTemperature");
  public static final Resource mass = resource("mass");
  public static final Resource volume = resource("volume");
  public static final Resource kg = resource("kilogram");
  public static final Resource kelvin = resource("kelvin");
  public static final Resource cubicMetre = resource("cubicMetre");

  // Properties
  public static final Property hasVolumeInL = property("hasVolumeInL");
  public static final Property holdsPressure = property("holdsPressure");
  public static final Property isMultipleOf = property("isMultipleOf");

  public static final Property inUnitSystem = property("inUnitSystem");
  public static final Property hasBaseUnit = property("hasBaseUnit");
  public static final Property unitSymbol = property("unitSymbol");
  public static final Property unitMultiplier = property("unitMultiplier");
  public static final Property unitOffset = property("unitOffset");
  public static final Property representsPhysicalQuantity = property("representsPhysicalQuantity");
  public static final Property measuredIn = property("measuredIn");
  public static final Property containsSubstance = property("containsSubstance");
  public static final Property ofSubstance = property("ofSubstance");
  public static final Property ofProportion = property("ofProportion");
  public static final Property massInKg = property("massInKg");
  public static final Property specificHeatOfMaterial = property("specificHeatOfMaterial");

  // Internal
  private static Resource resource(String local) { return ResourceFactory.createResource(ns + local); }
  private static Property property(String local) { return ResourceFactory.createProperty(ns, local); }

  private Brew() {}
}
