/**
 * Represents a unit dimension.
 * 
 * Whether it is a unit of mass, a unit of length, ...
 */
class Dim {
	public static Length = new Dim();
	public static Mass = new Dim();
	public static Temperature = new Dim();
	public static Volume = new Dim();
	
	public static all() { return [Dim.Length, Dim.Mass, Dim.Temperature, Dim.Volume]; }
}