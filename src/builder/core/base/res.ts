/// <reference path="iri.ts" />

abstract class Res {
  constructor(private _iri : string) {}

  get iri() {
    return this._iri;
  }
}
