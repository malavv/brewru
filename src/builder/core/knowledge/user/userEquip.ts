/// <reference path="../domain/equipment.ts" />

class UserEquip {
  private hardcoded: Equipment[] = [
    new Equipment("user:65galKettle", "Kettle 6.5gal"),
    new Equipment("user:6galBottlingBucket", "Bottling Bucket 5gal"),
    new Equipment("user:5galCarboy", "Glass Carboy 5gal"),
    new Equipment("user:grolshBottles", "Grolsh Bottles")
  ];

  public getAll() : Equipment[] {
    return this.hardcoded.slice(0);
  }

  public getById(id:string) : Equipment {
    return this.hardcoded.filter(e => e.id == id)[0];
  }
}