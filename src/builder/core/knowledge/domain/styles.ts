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

module Styles {
  var allGuides: Array<RawStyleGuide>;
  var allStyles: Array<Style>;
  var styleByRef: {[ref:string]: Style} = {};

  /**
   * Lists all known style.
   *
   * Wait for StyleLoaded event.
   * @returns {Array<Style>}
   */
  export function getAll() {
    return allStyles;
  }

  /**
   * Get a specific Style by its unique reference.
   * @param ref Unique Reference of the Style.
   * @returns {Style}
   */
  export function byRef(ref:string) : Style {
    return styleByRef[ref];
  }

  function onServerLoaded(server:Server) {
    Log.info("Styles", "Loading Styles");
    server.getStyles()
        .then(data => { allGuides = <any>data; })
        .then(loadStyles)
        .then((_) => {
          Log.info("Styles", "Styles loaded")
        })
        .then(() => { bus.publish(MessageType.StylesLoaded, this); });
  }

  function loadStyles() {
    var styleMap : {[ref:string]: RawStyle} = {};
    var categoryMap : {[ref:string]: RawCategory} = {};

    // Filling temporary maps.
    allGuides.forEach(guide => {
      guide.styles.forEach(s => { styleMap[s.ref] = s; });
      guide.categories.forEach(c => { categoryMap[c.ref] = c; });
    });

    // Fill all styles
    allStyles = _.flatten(_.map(allGuides,
        guide => _.flatten(_.map(guide.categories,
            category => _.flatten(_.map(category.styles,
                style => new Style(guide.ref, category, styleMap[style])))))));

    // Make Helper Dictionary
    allStyles.forEach((s) => { styleByRef[s.getRef()] = s; });
  }

  bus.suscribe(MessageType.ServerConnected, (server) => { onServerLoaded(server);  }, null);
}