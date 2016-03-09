/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

/**
 * Presents the general characteristics of the Recipe.
 *
 * This is a quick overview that let's you see quickly what this recipe is about.
 */
class RecipeDescription extends Polymer.DomModule {
  public recipe:Recipe;
  public style:string;
  public styles: Array;

  public ready() {
    bus.suscribe(MessageType.StylesLoaded, () => { this.async(() => { this.stylesLoaded(); }); }, this);
  }

  public stylesLoaded() {
    console.log("StylesLoaded");
    this.set('styles', Styles.getAll());
  }

  public attached() {
    this.$.selectStyle.value = 'noneselected';
  }

  public onStyleChanged(ref:string) {
    // If already the correct one.
    if (this.recipe.style != null && this.recipe.style.getRef() != null && this.recipe.style.getRef() == ref) { return; }

    var style = Styles.byRef(ref);

    this.set('recipe.style', style);
    this.set('style', style != null ? style.getRef() : 'noneselected');
  }
}

window.Polymer(window.Polymer.Base.extend(RecipeDescription.prototype, {
  is: 'recipe-description',

  properties: {
    recipe: {
      type: Object,
      notify: true
    },
    styles: {
      type: Array,
      value: () => []
    },
    style: {
      type: String,
      observer: 'onStyleChanged'
    }
  }
}));