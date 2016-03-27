/// <reference path="log.ts" />

class Iri {
  public static isAnon(iri: string) : boolean {
    return Iri.split(iri)[0] === "";
  }
  public static getNs(iri: string) : string {
    return Iri.split(iri)[0];
  }
  public static getRemainder(iri: string) : string {
    return Iri.split(iri)[1];
  }
  private static split(iri: string) : string[] {
    if (iri == null || !(typeof iri === 'string') || iri.indexOf(':') == -1) {
      Log.warn('Iri', 'Invalid IRI : ' + iri);
      return ['', ''];
    }
    return iri.split(":");
  }
}
