interface IPolymer {
	(name: string, prototype: any) : any;
	getRegisteredPrototype(name: string): any;
}

declare var Polymer: IPolymer;