/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class AppSplash extends Polymer.DomModule {
  private isChoosing: Boolean;

  ready() {
    this.isChoosing = false;
  }
  private createNew() {
    bus.publish(MessageType.RecipeSelected, this.createNewRecipe());
  }
  private loadRecipe() {
    this.isChoosing = true;
  }
  private _onRecipeSelected(evt: any) {
    bus.publish(MessageType.RecipeSelected, evt.target.files[0]);
  }


  private complexRecipe() {
    bus.publish(MessageType.RecipeSelected, this.createComplexRecipe());
  }
  private simpleRecipe() {
    bus.publish(MessageType.RecipeSelected, this.createBaseRecipe());
  }

  private createNewRecipe() : Recipe {
    return new Recipe(Equipments.byRef("brewru:kettle_6.5"));
  }

  private createBaseRecipe() : Recipe {
    var
      recipe = new Recipe(Equipments.byRef("brewru:kettle_6.5")),
      kettle = recipe.getReactors()[0],

      // Ingredient
      tapWater:Substance = new Substance("brew:tapwater", SubstanceType.Water, [PhysQty.byRef("brewru:volume")]),
      lme:Substance = new Substance("brew:lmeclear", SubstanceType.Fermentable, [PhysQty.byRef("brewru:volume")]),
      dme:Substance = new Substance("brew:dmeclear", SubstanceType.Fermentable, [PhysQty.byRef("brewru:mass")]),
      columbus:Substance = new Substance("brew:columbus", SubstanceType.Hops, [PhysQty.byRef("brewru:mass")]),

      // Common Quantity
      water23l: Quantity = new Quantity(23, SU('L')),
      oneKg: Quantity = new Quantity(1, SU('kg')),
      fiftyGram: Quantity = new Quantity(50, SU('g'));

    // Recipe Description
    recipe.description = 'APA recipe from xBeeriment';
    recipe.style = Styles.byRef("brewru:bjcp_2015_21A");
    recipe.name = 'xAPA';

    // Recipe
    kettle
        .addIng('Add Water', tapWater, water23l)
        .heat('Bring to a boil', TempTarget.getBoil())
        .addIng('Add LME', lme, oneKg)
        .addIng('Add DME', dme, oneKg)
        .heat('Maintain for 60 min', new TimeTarget(60, SU('min')));

    // Main Boil
    kettle.getHeat()[1]
        .onBegin()
        .addIng('Bittering Hop', columbus, fiftyGram)
        .toEnd(new TimeTarget(25, SU('min')))
        .addIng('Dual Purpose Hop', columbus, fiftyGram)
        .onEnd()
        .addIng('Aroma Hop', columbus, fiftyGram);
    return recipe;
  }
  private createComplexRecipe() : Recipe {
    var
        recipe = new Recipe(Equipments.byRef("brewru:kettle_6.5")),

        kettle = recipe.getReactors()[0],
        firstFerm:EquipmentStep,

        bucket:Equipment = Equipments.byRef("brewru:bucket_5gal"),
        carboy:Equipment = Equipments.byRef("brewru:glassCarboy_5.5"),
        bottles:Equipment = Equipments.byRef("brewru:newGrolshBottles"),

    // Ingredient
        tapWater:Substance = new Substance("brew:tapwater", SubstanceType.Water, [PhysQty.byRef("brewru:volume")]),
        lme:Substance = new Substance("brew:lmeclear", SubstanceType.Fermentable, [PhysQty.byRef("brewru:volume")]),
        dme:Substance = new Substance("brew:dmeclear", SubstanceType.Fermentable, [PhysQty.byRef("brewru:mass")]),
        columbus:Substance = new Substance("brew:columbus", SubstanceType.Hops, [PhysQty.byRef("brewru:mass")]),
        yeast: Substance = new Substance("brew:entitiesus05", SubstanceType.Yeast, [PhysQty.byRef("brewru:counts")]),
        primingSugar: Substance = new Substance("brew:tableSugar", SubstanceType.Fermentable, [PhysQty.byRef("brewru:mass")]),

    // Common Quantity
        water23l: Quantity = new Quantity(23, SU('L')),
        oneKg: Quantity = new Quantity(1, SU('kg')),
        fiftyGram: Quantity = new Quantity(50, SU('g')),
        threeCup: Quantity = new Quantity(3, SU('cup'));

    // Recipe Description
    recipe.description = 'APA recipe from xBeeriment';
    recipe.style = Styles.byRef("brewru:bjcp_2015_21A");
    recipe.name = 'xAPA';

    // Recipe
    kettle
        .addIng('Add Water', tapWater, water23l)
        .heat('Bring to a boil', TempTarget.getBoil())
        .addIng('Add LME', lme, oneKg)
        .addIng('Add DME', dme, oneKg)
        .heat('Maintain for 60 min', new TimeTarget(60, SU('min')));

    // Main Boil
    kettle.getHeat()[1]
        .onBegin()
        .addIng('Bittering Hop', columbus, fiftyGram)
        .toEnd(new TimeTarget(25, SU('min')))
        .addIng('Dual Purpose Hop', columbus, fiftyGram)
        .onEnd()
        .addIng('Aroma Hop', columbus, fiftyGram);

    // Cooling
    kettle.cool('Cool to 22C', new TempTarget(22, SU("°C")));

    // First Fermentation
    firstFerm = kettle.transferTo(bucket, [MiscStepType.Decantation, MiscStepType.Moderate_Aeration]);
    firstFerm
        .addIng('Add Yeast', yeast, new Quantity(1, SU('u')))
        .ferment('First Fermentation', new TimeTarget(4, SU('day')));

    // Dry Hopping
    firstFerm.getFerm()[0]
        .toEnd(new TimeTarget(2, SU('day')))
        .addIng('Dry Hoping', columbus, fiftyGram);

    firstFerm.transferTo(carboy, [MiscStepType.Decantation])
        .ferment('Second Fermentation', new TimeTarget(21, SU('day')))
        .transferTo(bucket, [MiscStepType.Decantation])
        .addIng('Priming Sugar', primingSugar, threeCup)
        .transferTo(bottles, [MiscStepType.Decantation]);

    return recipe;
  }
}

window.Polymer(window.Polymer.Base.extend(AppSplash.prototype, {
  is: 'app-splash',

  properties: {
    isChoosing: Boolean
  }
}));