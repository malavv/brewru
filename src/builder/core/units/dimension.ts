/** Abstract dimension associated with a unit. */
enum Dim {
  Length,
  Mass,
  Temperature,
  Temporal,
  Unit,
  Volume
}

function allDimensions() {
  return [
    Dim.Length,
    Dim.Mass,
    Dim.Temperature,
    Dim.Temporal,
    Dim.Unit,
    Dim.Volume
  ];
}