class MessageType {
	name:string;
	id:number;
	
	constructor(name:string, id:number) {
		this.name = name;
		this.id = id;
	}
	
	static unknown:MessageType = new MessageType('Unknown', 0);
	static NewStepCreated:MessageType = new MessageType('NewStepCreated', 1);
	static RecipeChanged:MessageType = new MessageType('RecipeChanged', 2);
};