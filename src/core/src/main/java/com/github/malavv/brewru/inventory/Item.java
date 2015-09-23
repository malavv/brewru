package com.github.malavv.brewru.inventory;


import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import java.util.ArrayList;
import java.util.List;

public class Item {
  public final ItemType type;
  public final String ref;
  public final String name;

  private List<Stock> stocks;

  public Item(final ItemType type, final String ref, final String name) {
    this.ref = ref;
    this.type = type;
    this.stocks = new ArrayList<>();
    this.name = name;
  }

  public Item addStock(final Stock stock) {
    stock.item = this;
    stocks.add(stock);
    return this;
  }

  public String getName() {
    return name;
  }

  public JsonObject toJson() {
    return Json.createObjectBuilder()
        .add("type", type.toString())
        .add("ref", ref)
        .add("name", getName())
        .add("stocks", stocks.stream()
            .map(Stock::toJson)
            .collect(Json::createArrayBuilder, JsonArrayBuilder::add, JsonArrayBuilder::add))
        .build();
  }
}
