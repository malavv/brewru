/// <reference path="../../base/log.ts" />
/// <reference path="style.ts" />
/// <reference path="../../../lib/underscore/underscore.d.ts" />

interface RawStyleGuide {
  org: string;
  ref: string;
  year: number;
  categories: Array<RawCategory>;
  styles: Array<RawStyle>;
}
interface RawStyle {
  code: string;
  ref: string;
}
interface RawCategory {
  code: string;
  ref: string;
  styles: Array<string>;
}

abstract class Styles {
  private static allGuides: RawStyleGuide[];
  private static allStyles: Style[];
  private static styleByRef: {[ref:string]: Style} = {};

  /**
   * Lists all known style.
   *
   * Wait for StyleLoaded event.
   * @returns {Array<Style>}
   */
  public static getAll() : Style[] {
    return Styles.allStyles;
  }

  /**
   * Get a specific Style by its unique reference.
   * @param ref Unique Reference of the Style.
   * @returns {Style}
   */
  public static byRef(ref:string) : Style {
    return Styles.styleByRef[ref];
  }

  public static onServerLoaded(server:Server) : Promise<void> {
    Log.info("Styles", "Loading Styles");
    return server.getStyles()
        .then(data => { Styles.allGuides = <any>data; })
        .then(Styles.loadStyles);
  }

  private static loadStyles() {
    var styleMap : {[ref:string]: RawStyle} = {};
    var categoryMap : {[ref:string]: RawCategory} = {};

    // Filling temporary maps.
    Styles.allGuides.forEach(guide => {
      guide.styles.forEach(s => { styleMap[s.ref] = s; });
      guide.categories.forEach(c => { categoryMap[c.ref] = c; });
    });

    // Fill all styles
    Styles.allStyles = _.flatten(_.map(Styles.allGuides,
        guide => _.flatten(_.map(guide.categories,
            category => _.flatten(_.map(category.styles,
                style => new Style(guide.ref, category, styleMap[style])))))));

    // Make Helper Dictionary
    Styles.allStyles.forEach((s) => { Styles.styleByRef[s.iri] = s; });

    Log.info("Styles", Styles.allGuides.length + " Guides and " + Object.keys(Styles.allStyles).length + " Styles loaded");
  }
}
