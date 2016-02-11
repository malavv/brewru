/// <reference path="style.ts" />

module Styles {
  export const americanLightLager = new Style('American Light Lager', '1', '1A');
  export const americanLager = new Style('American Lager', '1', '1B');
  export const creamAle = new Style('Cream Ale', '1', '1C');
  export const americanWheatBeer = new Style('American Wheat Beer', '1', '1D');
  export const americanIpa = new Style('American IPA', '21', '21Z');

  export function getAll() {
    return [
      americanLightLager,
      americanLager,
      creamAle,
      americanWheatBeer,
      americanIpa
    ];
  }

  export function getBjcp(styleId:string) {
    return Styles.getAll().filter((s:Style):boolean => {
      return s.bjcpStyle == styleId;
    });
  }
}