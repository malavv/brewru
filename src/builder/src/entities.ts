/// <reference path="base/conceptRef.ts" />

class Entities {
    static tapWater: ConceptRef = new OntoRef('brew:tapWater', 'Tap Water');
    static inventory: ConceptRef = new OntoRef('brew:personalInventory', 'Personal Inventory');
    static kg: ConceptRef = new OntoRef('unit:kilogram', 'kilogram');
    static liter: ConceptRef = new OntoRef('unit:liter', 'liter');
    static syrup: ConceptRef = new OntoRef('brew:brewersSyrop', 'Brewer\'s Syrup');
    static c120: ConceptRef = new OntoRef('brew:crystal120', 'Crystal 120');
    static c60: ConceptRef = new OntoRef('brew:crystal60', 'Crystal 60');
    static paleChoco: ConceptRef = new OntoRef('brew:PaleChocolate', 'Pale Chocolate');
    static blackMalt: ConceptRef = new OntoRef('brew:BlackMalt', 'Black Malt');
    static flakedRye: ConceptRef = new OntoRef('brew:FlakedRye', 'Flaked Rye');
    static rolledOat: ConceptRef = new OntoRef('brew:RolledOat', 'Rolled Oat');
    
    static yeastNutrient: ConceptRef = new OntoRef('brew:yeastNutrient', 'Yeast Nutrient');
    
    static w2112: ConceptRef = new OntoRef('brew:w2112', 'Wyeast California Lager');
    
}