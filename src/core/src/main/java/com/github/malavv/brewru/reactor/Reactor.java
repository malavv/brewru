package com.github.malavv.brewru.reactor;

import com.github.malavv.brewru.knowledge.Equipment;
import com.github.malavv.brewru.knowledge.Ingredient;
import com.github.malavv.brewru.unit.Quantity;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

public interface Reactor {
  Equipment.Vessel getVessel();
  Stream<Substance> getSubstances();
  Optional<Integer> getSubstanceIdx(Substance substance);
  int getNumOfMinutes();
  Quantity getTemperature(int atMinute);
  double getPh(int atMinute);
  Quantity getVolume(int atMinute);

  List<double[]> getData();

  Reactor addition(final Ingredient ingredient, final Quantity qty, final Quantity temp) throws Reactor.Exception;

  class Exception extends java.lang.Exception {
    public Exception(String message) { super(message); }
  }
}
