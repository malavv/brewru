/// <reference path="../../base/log.ts" />
/// <reference path="style.ts" />

module Styles {
  var allGuides: Array<Object>;
  var allStyles: Array<Object> = [];

  export const americanLightLager = null;// new Style('American Light Lager', '1', '1A');
  export const americanLager = null;//new Style('American Lager', '1', '1B');
  export const creamAle = null;//new Style('Cream Ale', '1', '1C');
  export const americanWheatBeer = null;//new Style('American Wheat Beer', '1', '1D');
  export const americanIpa = null;//new Style('American IPA', '21', '21Z');

  export function getAll() {
    return allStyles;
  }

  //export function getBjcp(styleId:string) {
  //  return Styles.getAll().filter((s:Style):boolean => {
  //    return s.bjcpStyle == styleId;
  //  });
  //}

  function onServerLoaded(server:Server) {
    Log.info(Styles, "Loading Styles");
    server.getStyles()
        .then(data => { allGuides = <any>data; })
        .then(loadStyles)
        .then(() => { bus.publish(MessageType.StylesLoaded, this); });
  }

  function loadStyles() {
    var styleMap = {};

    allGuides.forEach(guide => {
      guide.styles.forEach(s => { styleMap[s.ref] = s; });

      guide.categories.forEach(category => {
        category.styles.forEach(style => {
          var ref = styleMap[style];
          allStyles.push(new Style(guide.ref, category, ref));
        })
      })
    });
  }

  bus.suscribe(MessageType.ServerConnected, (server) => { onServerLoaded(server);  }, null);
}