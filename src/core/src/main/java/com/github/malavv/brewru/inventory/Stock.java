package com.github.malavv.brewru.inventory;

import com.github.malavv.brewru.unit.Quantity;

import javax.json.Json;
import javax.json.JsonObject;
import java.time.LocalDate;

public class Stock {
  public Item item;
  public Quantity quantity;
  public LocalDate boughtOn;
  public String provider;

  public Stock(Quantity quantity, LocalDate boughtOn, String provider) {
    this.quantity = quantity;
    this.boughtOn = boughtOn;
    this.provider = provider;
  }

  public JsonObject toJson() {
    return Json.createObjectBuilder()
        .add("item", item.ref)
        .add("quantity", quantity.toJson())
        .add("boughtOn", boughtOn.toString())
        .add("provider", provider)
        .build();
  }
}
