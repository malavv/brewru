package com.github.malavv.brewru.reactor;

import com.github.malavv.brewru.knowledge.Equipment;
import com.github.malavv.brewru.knowledge.Ingredient;
import com.github.malavv.brewru.unit.Quantity;

public interface Reactor {
  boolean hasVessel();

  // Must always be called
  Reactor setVessel(final Equipment.Vessel vessel);

  Reactor addition(final Ingredient ingredient, final Quantity qty, final Quantity temp) throws Reactor.Exception;

  class Exception extends java.lang.Exception {
    public Exception(String message) { super(message); }
  }
}
