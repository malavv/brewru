package com.github.malavv.brewru.inventory;

public class Inventory {

  private int i = 0;
  public int inc() {
    return i++;
  }

//  public List<Item> sync() {
//    UnitSystem system = new UnitSystem();
//    system.name = "SI";
//    system.ref = "brew:Si";
//
//    Unit kg = new Unit();
//    kg.dimension = Dimension.Mass;
//    kg.multiplier = 1;
//    kg.offset = 0;
//    kg.ref = "brew:Kg";
//    kg.symbol = "kg";
//    kg.system = system;
//
//    Quantity quantity = new Quantity(1, kg);
//
//    return Stream.generate(() ->{
//        Item lmePale = new Item(ItemType.Fermentables, "brew:lme" + inc(), "Briess Golden Light LME");
//        lmePale.addStock(new Stock(quantity, LocalDate.now(), "Moût International"));
//        return lmePale;
//      })
//      .limit(10)
//      .collect(Collectors.toList());
//  }
}
