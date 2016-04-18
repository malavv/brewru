package com.github.malavv.brewru.knowledge;

import com.github.malavv.brewru.onto.Brew;
import com.github.malavv.brewru.onto.Resolver;
import com.github.malavv.brewru.unit.Quantity;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.Resource;

import java.util.logging.Logger;

/**
 * Vessel of liquid on to which heat can be applied.
 */
public class Kettle extends Equipment.Vessel {
  private final double specificHeatOfMaterial;
  private final double massInKg;
  private final Unit kg;

  Kettle(Resource ref, Model model) {
    super(ref, model);
    specificHeatOfMaterial = ref.getProperty(Brew.specificHeatOfMaterial).getDouble();
    massInKg = ref.getProperty(Brew.massInKg).getDouble();
    type = Type.Kettle;
    kg = Unit.from(Brew.kg).get();
  }

  public Double getThermalInertia() { return getMass().magnitude * getSpecificHeatOfMaterial(); }
  public Quantity getMass() { return new Quantity(massInKg, kg); }
  public double getSpecificHeatOfMaterial() { return specificHeatOfMaterial; }
}
