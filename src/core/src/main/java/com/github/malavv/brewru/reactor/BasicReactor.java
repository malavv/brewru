package com.github.malavv.brewru.reactor;

import com.github.malavv.brewru.knowledge.Equipment;
import com.github.malavv.brewru.knowledge.Ingredient;
import com.github.malavv.brewru.unit.Quantity;

import java.util.logging.Logger;

public class BasicReactor implements Reactor {
  private Equipment.Vessel vessel;

  @Override
  public boolean hasVessel() {
    return vessel != null;
  }

  @Override public Reactor setVessel(Equipment.Vessel vessel) {
    this.vessel = vessel;
    return this;
  }

  @Override public Reactor addition(Ingredient ingredient, Quantity qty) {
    if (vessel == null) {
      Logger.getLogger("BasicReactor").severe("No vessel in reactor.");
      return this;
    }

    return null;
  }
}
