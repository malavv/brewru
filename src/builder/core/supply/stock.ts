class Stock {
  private quantity: Quantity;
  private boughtOn: Date;
  private provider: String;

  public static fromRaw(raw: any): Stock {
    var s = new Stock();
    s.quantity = raw.quantity;
    s.boughtOn = new Date(raw.boughtOn);
    s.provider = raw.provider;
    return s;
  }
}
