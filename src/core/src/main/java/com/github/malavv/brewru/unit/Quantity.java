package com.github.malavv.brewru.unit;

import com.github.malavv.brewru.gson.QuantityJson;
import com.google.gson.annotations.JsonAdapter;

@JsonAdapter(QuantityJson.class)
public class Quantity {
  public final double magnitude;
  public final Unit unit;

  public Quantity(double magnitude, Unit unit) {
    this.magnitude = magnitude;
    this.unit = unit;
  }
}
