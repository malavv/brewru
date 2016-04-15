package com.github.malavv.brewru.reactor;

import com.github.malavv.brewru.knowledge.Equipment;
import com.github.malavv.brewru.knowledge.Ingredient;
import com.github.malavv.brewru.unit.Quantity;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

public interface Reactor {

  Equipment.Vessel getVessel();
  Stream<Substance> getSubstances();
  Optional<Integer> getSubstanceIdx(Substance substance);
  int getLengthInMin();

  Reactor addition(final Ingredient ingredient, final Quantity qty, final Quantity temp) throws Reactor.Exception;

  Double[][] getData();

  double getTemperature();
  double getPh();
  double getVolume();

  class Exception extends java.lang.Exception {
    public Exception(String message) { super(message); }
  }
}
