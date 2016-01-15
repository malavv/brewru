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
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

public class Inventory {

  private int i = 0;
  public int inc() {
    return i++;
  }

  public List<Item> sync() {
    Item yeastNutrient = new Item(ItemType.Miscellaneous, "brew:YeastNutrient", "North. Brew. Yeast Nutrient");

    UnitSystem system = new UnitSystem();
    system.name = "SI";
    system.ref = "brew:Si";

    Unit kg = new Unit();
    kg.dimension = Dimension.Mass;
    kg.multiplier = 1;
    kg.offset = 0;
    kg.ref = "brew:Kg";
    kg.symbol = "kg";
    kg.system = system;

    Quantity quantity = new Quantity();
    quantity.magnitude = 1;
    quantity.unit = kg;

    return Stream.generate(() ->{
        Item lmePale = new Item(ItemType.Fermentables, "brew:lme" + inc(), "Briess Golden Light LME");
        lmePale.addStock(new Stock(quantity, LocalDate.now(), "Moût International"));
        return lmePale;
      })
      .limit(10)
      .collect(Collectors.toList());
  }

  public JsonObject syncMsg(final List<Item> items) {
    return Json.createObjectBuilder()
        .add("items", items.stream()
            .map(Item::toJson)
            .collect(Json::createArrayBuilder, JsonArrayBuilder::add, JsonArrayBuilder::add))
        .build();
  }
}
