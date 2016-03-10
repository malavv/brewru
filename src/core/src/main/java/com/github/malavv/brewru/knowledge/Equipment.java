package com.github.malavv.brewru.knowledge;

import com.github.malavv.brewru.onto.Brew;
import com.github.malavv.brewru.onto.KBConcept;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.Statement;
import com.hp.hpl.jena.vocabulary.RDF;

import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Equipment extends KBConcept {
  public Type getType() {
    return this instanceof Kettle ? Type.Kettle : Type.Vessel;
  }

  public enum Type {
    Kettle,
    Vessel
  }

  public static class Kettle extends Vessel {
    private Kettle(Resource ref, Model model) {
      super(ref, model);
    }
  }

  public static class Vessel extends Equipment {
    private double volumeInL;
    private boolean holdsPressure;
    private boolean isMultipleOf;

    private Vessel(Resource ref, Model model) {
      super(ref);
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
             .mapWith(equip -> Equipment.fromKB(equip, model, Type.Kettle)).toList().stream(),
        model.listStatements(null, RDF.type, Brew.vessel)
             .mapWith(Statement::getSubject)
             .mapWith(equip -> Equipment.fromKB(equip, model, Type.Vessel)).toList().stream())
          .filter(Optional::isPresent).map(Optional::get)
          .collect(Collectors.toList());
  }

  private static Optional<Equipment> fromKB(final Resource equipment, final Model model, final Type type) {
    switch (type) {
      case Kettle:
        return Optional.of(new Kettle(equipment, model));
      case Vessel:
        return Optional.of(new Vessel(equipment, model));
      default:
        return Optional.empty();
    }
  }

  private Equipment(final Resource ref) {
    super(ref);
  }
}
