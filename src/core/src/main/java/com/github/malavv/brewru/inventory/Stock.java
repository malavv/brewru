package com.github.malavv.brewru.inventory;

import com.github.malavv.brewru.unit.Quantity;

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
}
