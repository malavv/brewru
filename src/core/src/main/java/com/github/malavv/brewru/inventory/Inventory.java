package com.github.malavv.brewru.inventory;

import com.github.malavv.brewru.unit.Dimension;
import com.github.malavv.brewru.unit.Quantity;
import com.github.malavv.brewru.unit.Unit;
import com.github.malavv.brewru.unit.UnitSystem;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class Inventory {

  public List<Item> sync() {
    Item lmePale = new Item(ItemType.Fermentables, "brew:LmePale", "Briess Golden Light LME");
    Item yeastNutrient = new Item(ItemType.Miscellaneous, "brew:YeastNutrient", "North. Brew. Yeast Nutrient");

    Quantity quantity = new Quantity();
    quantity.magnitude = 1;

    Unit kg = new Unit();
    kg.dimension = Dimension.Mass;
    kg.multiplier = 1;
    kg.offset = 0;
    kg.ref = "brew:Kg";
    kg.symbol = "kg";

    UnitSystem system = new UnitSystem();
    system.name = "SI";
    system.ref = "brew:Si";

    kg.system = system;
    quantity.unit = kg;

    lmePale.addStock(
        new Stock(
            quantity,
            LocalDate.now(),
            "Moût International"
        )
    );


    UnitSystem us = new UnitSystem();
    us.name = "US Cust.";
    us.ref = "brew:UsCust";
    Unit tsp = new Unit();
    tsp.dimension = Dimension.Volume;
    tsp.multiplier = 1;
    tsp.offset = 0;
    tsp.ref = "brew:Teaspoon";
    tsp.symbol = "tsp";
    tsp.system = us;
    Quantity quarterTsp = new Quantity();
    quarterTsp.magnitude = 0.25;
    quarterTsp.unit = tsp;

    yeastNutrient.addStock(new Stock(
      quarterTsp, LocalDate.now(), "Moût Int."
    ));

    return Arrays.asList(
        lmePale,
        yeastNutrient
    );
  }

  public JsonObject syncMsg(final List<Item> items) {
    return Json.createObjectBuilder()
        .add("items", items.stream()
            .map(Item::toJson)
            .collect(Json::createArrayBuilder, JsonArrayBuilder::add, JsonArrayBuilder::add))
        .build();
  }
}
