/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class RecipeDescription extends Polymer.DomModule {
  public recipe:Recipe;

  public listStyles() {
    return Styles.getAll();
  }

  public getStyleByBjcpStyleCode(bjcpStyle:string) {
    var style = Styles.getAll().filter((s:Style):boolean => {
      return s.bjcpStyle == bjcpStyle;
    });
    if (style != null && Array.isArray(style) && style.length == 1)
      this.set('recipe.style', style[0]);
    console.log('getStyleByCategory', bjcpStyle);
  }
}

window.Polymer(window.Polymer.Base.extend(RecipeDescription.prototype, {
  is: 'recipe-description',

  properties: {
    recipe: {
      type: Object,
      notify: true
    },
    bjcp: {
      type: String,
      observer: 'getStyleByBjcpStyleCode'
    }
  }
}));