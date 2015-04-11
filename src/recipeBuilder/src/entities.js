define(['base/concept'], function(Concept) {
  return {
    tapWater: new Concept('brew:tapWater', 'Tap Water'),
    inventory: new Concept('brew:personalInventory', 'Personal Inventory'),
    kg: new Concept('unit:kilogram', 'kilogram'),
    liter: new Concept('unit:liter', 'liter'),
    syrup: new Concept('brew:brewersSyrop', 'Brewer\'s Syrup'),
    c120: new Concept('brew:crystal120', 'Crystal 120'),
    c60: new Concept('brew:crystal60', 'Crystal 60'),
    paleChoco: new Concept('brew:PaleChocolate', 'Pale Chocolate'),
    blackMalt: new Concept('brew:BlackMalt', 'Black Malt'),
    flakedRye: new Concept('brew:FlakedRye', 'Flaked Rye'),
    rolledOat: new Concept('brew:RolledOat', 'Rolled Oat')
  };
});