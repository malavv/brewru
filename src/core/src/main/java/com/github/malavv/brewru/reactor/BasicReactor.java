package com.github.malavv.brewru.reactor;

import com.github.malavv.brewru.knowledge.Equipment;
import com.github.malavv.brewru.knowledge.Ingredient;
import com.github.malavv.brewru.knowledge.Unit;
import com.github.malavv.brewru.onto.Brew;
import com.github.malavv.brewru.unit.Quantity;

import java.util.*;

public class BasicReactor implements Reactor {
  private Equipment.Vessel vessel;
  private Set<Substance> substances;

  public BasicReactor() {
    substances = new HashSet<>();
  }

  @Override
  public boolean hasVessel() {
    return vessel != null;
  }

  @Override public Reactor setVessel(Equipment.Vessel vessel) {
    this.vessel = vessel;
    return this;
  }

  @Override
  public Reactor addition(final Ingredient ingredient, Quantity qty, Quantity temp) throws Reactor.Exception {
    if (ingredient == null || qty == null || temp == null)
      throw new Reactor.Exception("Invalid parameter to the addition");
    if (!hasVessel())
      throw new Reactor.Exception("No vessel in reactor");
    if (!ingredient.canBeMeasuredIn(qty.unit.getPhysicalQuantity()))
      throw new Reactor.Exception("Invalid unit for the ingredient");
    if (!temp.unit.getPhysicalQuantity().equals(Unit.PhysicalQuantity.byRef(Brew.temperature)))
      throw new Reactor.Exception("Invalid unit for the temperature");
    doAddition(ingredient, qty, temp);
    return this;
  }

  private void doAddition(Ingredient ingredient, Quantity qty, Quantity temp) {
    prepareForNewSubstances(ingredient.getConstituents());

    final double moles = ingredient.getQtyOfSubstance(qty);
    ingredient.getProportions().forEach((substance, proportion) -> addSubstance(substance, moles * proportion));
  }

  private void addSubstance(Substance substance, double moles) {
    System.out.println("Adding substance " + substance.getRef() + " : " + moles);
  }

  private void prepareForNewSubstances(Collection<Substance> newSubstances) {
    substances.addAll(newSubstances);
  }
}
