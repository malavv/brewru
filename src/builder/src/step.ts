class Step {
	id: string;
	name: string;
	type: any;
	
	constructor(name: string, type: any) {
		this.id = 'anon:0';
		this.name = name;
		this.type = type;
	}
	
	toString() : string {
		//return _.template('{{constructor.name}}<{{reactor.use}}>[{{inputs.length}}->{{name}}({{id}})->{{outputs.length}}]')(this);
		
		return this.name;
	}
}