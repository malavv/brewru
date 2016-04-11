package com.github.malavv.brewru.reactor;

import com.github.malavv.brewru.knowledge.Equipment;
import com.github.malavv.brewru.knowledge.Ingredient;
import com.github.malavv.brewru.unit.Quantity;

public interface Reactor {
  boolean hasVessel();

  // Must always be called
  Reactor setVessel(final Equipment.Vessel vessel);

  Reactor addition(final Ingredient ingredient, final Quantity qty);
}
