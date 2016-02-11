/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class RecipeDescription extends Polymer.DomModule {
  public recipe:Recipe;
  public bjcp:string;

  public listStyles() {
    return Styles.getAll();
  }

  public attached() {
    this.$.selectStyle.value = this.bjcp;
  }

  public getStyleByBjcpStyleCode(bjcpStyle:string) {
    // If already the correct one.
    if (this.recipe.style.bjcpStyle == bjcpStyle)
      return;

    var style = Styles.getBjcp(bjcpStyle);
    if (style != null && Array.isArray(style) && style.length == 1)
      this.set('recipe.style', style[0]);
    console.log('getStyleByCategory', bjcpStyle);
  }

  public styleChanged(newStyle:Style, oldStyle:Style) {
    this.set('bjcp', newStyle.bjcpStyle);
    this.$.selectStyle.value = this.bjcp;
  }
}

window.Polymer(window.Polymer.Base.extend(RecipeDescription.prototype, {
  is: 'recipe-description',

  observers: [
    'styleChanged(recipe.style)'
  ],

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