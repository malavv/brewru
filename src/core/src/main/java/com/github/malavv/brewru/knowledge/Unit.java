package com.github.malavv.brewru.knowledge;

import com.github.malavv.brewru.onto.Brew;
import com.github.malavv.brewru.onto.KBConcept;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.Statement;
import com.hp.hpl.jena.vocabulary.RDF;

import java.util.Collection;
import java.util.Optional;

public class Unit extends KBConcept {
  public static class PhysicalQuantity extends KBConcept {
    public PhysicalQuantity(Resource ref) { super(ref); }
    public static PhysicalQuantity byRef(Resource ref) { return new PhysicalQuantity(ref); }
  }
  public static class UnitSystem extends KBConcept {
    public UnitSystem(Resource ref) { super(ref); }
    public static UnitSystem byRef(Resource ref) { return new UnitSystem(ref); }
  }

  private double offset;
  private double multiplier;
  private String symbol;
  private Optional<Unit> baseUnitRef = Optional.empty();
  private PhysicalQuantity physicalQuantity;
  private UnitSystem system;

  public double getOffset() { return offset; }
  public double getMultiplier() { return multiplier; }
  public String getSymbol() { return symbol; }
  public Optional<Unit> getBaseUnit() { return baseUnitRef; }
  public PhysicalQuantity getPhysicalQuantity() { return physicalQuantity; }
  public UnitSystem getSystem() { return system; }

  private Unit(final Model model, Resource ref) {
    super(ref);
    Optional.ofNullable(ref.getProperty(Brew.unitOffset))
        .ifPresent(val -> offset = val.getDouble());
    Optional.ofNullable(ref.getProperty(Brew.unitMultiplier))
        .ifPresent(val -> multiplier = val.getDouble());
    symbol = ref.getProperty(Brew.unitSymbol).getString();
    Optional.ofNullable(ref.getProperty(Brew.hasBaseUnit))
        .ifPresent(p -> {
          this.baseUnitRef = Optional.of(new Unit(model, p.getResource()));
          this.physicalQuantity = this.baseUnitRef.get().getPhysicalQuantity();
        });
    Optional.ofNullable(ref.getProperty(Brew.representsPhysicalQuantity))
        .ifPresent(p -> this.physicalQuantity = PhysicalQuantity.byRef(p.getResource()));
    Optional.ofNullable(ref.getProperty(Brew.inUnitSystem))
        .ifPresent(p -> this.system = UnitSystem.byRef(p.getResource()));
  }

  public static Collection<Unit> getAll(final Model model) {
    return model.listStatements(null, RDF.type, Brew.unit)
        .mapWith(Statement::getSubject)
        .mapWith(raw -> new Unit(model, raw))
        .toList();
  }
  public static Optional<Unit> from(Resource resource) {
    return Optional.empty();
  }
}
