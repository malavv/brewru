/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

/**
 * Presents the general characteristics of the Recipe.
 *
 * This is a quick overview that let's you see quickly what this recipe is about.
 */
class RecipeDescription extends Polymer.DomModule {
  public recipe : Recipe;
  public styles : Style[];

  // Inputs
  public style: string = 'noneselected';

  public created() {
    console.log('created');
    bus.suscribe(MessageType.StylesLoaded, () => {  this.stylesLoaded(); }, this);
  }

  public attached() {
    this.$.selectStyle.value = "noneselected";
  }

  public stylesLoaded() {
    console.log('stylesLoaded');
    this.set('styles', Styles.getAll());
  }

  public onStyleChanged(ref:string, old : string) {
    console.log('onStyleChanged');
    // If already the correct one.
    if (this.recipe.style != null && this.recipe.style.iri != null && this.recipe.style.iri == ref) { 
      if (this.$.selectStyle.value == "") {
        this.async(() => {
          this.$.selectStyle.value = this.recipe.style.iri;
        }, 0)
      }
      return; 
    }

    var style = Styles.byRef(ref);

    this.set('recipe.style', style);
    this.set('style', style != null ? style.iri : 'noneselected');
  }

  public onRecipeChanged(newRecipe:Recipe, oldRecipe:Recipe) {
    console.log('onRecipeChanged');
    this.set('style', newRecipe.style.iri || 'noneselected');
  }
}

window.Polymer(window.Polymer.Base.extend(RecipeDescription.prototype, {
  is: 'recipe-description',

  properties: {
    recipe: {
      type: Object,
      notify: true,
      observer: 'onRecipeChanged'
    },
    styles: {
      type: Array,
      value: () => <Style[]>[]
    },
    style: {
      type: String,
      observer: 'onStyleChanged'
    }
  }
}));
