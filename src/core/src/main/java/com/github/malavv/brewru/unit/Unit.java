package com.github.malavv.brewru.unit;

/**
 * There should already be a reference to this unit on the client side.
 * <p>
 * Therefore all communication can be restraint to the use of the reference.
 */
public class Unit {
  public String ref;
  public String symbol;
  public double offset;
  public double multiplier;
  public Dimension dimension;
  public UnitSystem system;
}
