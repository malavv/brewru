/// <reference path="../../base/res.ts" />
/// <reference path="Units.ts" />

const enum SubstanceType {
  Fermentable,
  Hops,
  Miscellaneous,
  Water,
  Yeast
}

let SubstanceTypes = [
  SubstanceType.Fermentable,
  SubstanceType.Hops,
  SubstanceType.Miscellaneous,
  SubstanceType.Water,
  SubstanceType.Yeast
];

class Substance extends Res {
  public type: SubstanceType;
  public measuredAs: PhysQty[];

  constructor(iri : string, t: SubstanceType, as : PhysQty[]) {
    super(iri);
    this.type = t;
    this.measuredAs = as;
  }
}
