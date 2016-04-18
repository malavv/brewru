package com.github.malavv.brewru.knowledge;

import com.github.malavv.brewru.onto.Brew;
import com.github.malavv.brewru.onto.KBConcept;
import com.github.malavv.brewru.unit.Quantity;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.Statement;
import com.hp.hpl.jena.vocabulary.RDF;

import java.util.Collection;
import java.util.Optional;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public abstract class Equipment extends KBConcept {
  public enum Type {
    Kettle,
    Vessel
  }

  protected Type type;

  private Equipment(Resource ref) {
    super(ref);
  }

  public static class Vessel extends Equipment {
    private double volumeInL;
    private boolean holdsPressure;
    private boolean isMultipleOf;

    public Vessel(Resource ref, Model model) {
      super(ref);
      this.type = Type.Vessel;
      volumeInL = ref.getProperty(Brew.hasVolumeInL).getDouble();
      holdsPressure = ref.getProperty(Brew.holdsPressure).getBoolean();
      Statement multipleOf = ref.getProperty(Brew.isMultipleOf);
      isMultipleOf = multipleOf != null && multipleOf.getBoolean();
    }

    public double getVolumeInL() {
      return volumeInL;
    }

    public boolean holdsPressure() {
      return holdsPressure;
    }

    public boolean isMultipleOf() {
      return isMultipleOf;
    }
  }

  public static Collection<Equipment> getAll(final Model model) {
    return
      Stream.concat(
        model.listStatements(null, RDF.type, Brew.kettle)
             .mapWith(Statement::getSubject)
             .mapWith(equip -> Equipment.fromKB(equip, model)).toList().stream(),
        model.listStatements(null, RDF.type, Brew.vessel)
             .mapWith(Statement::getSubject)
             .mapWith(equip -> Equipment.fromKB(equip, model)).toList().stream())
          .filter(Optional::isPresent).map(Optional::get)
          .collect(Collectors.toList());
  }

  public static Optional<Equipment> fromKB(final Resource equipment, final Model kb) {
    if (equipment == null) {
      Logger.getLogger("Equipment").warning("null equipment provided");
      return Optional.empty();
    }
    if (!kb.containsResource(equipment)) {
      Logger.getLogger("Equipment").warning("Equipment " + equipment.getLocalName() + " not in the knowledge base");
      return Optional.empty();
    }

    Resource type = equipment.getPropertyResourceValue(RDF.type);
    if (type.equals(Brew.kettle))
      return Optional.of(new Kettle(equipment, kb));
    else if (type.equals(Brew.vessel))
      return Optional.of(new Vessel(equipment, kb));
    else return Optional.empty();
  }
}
