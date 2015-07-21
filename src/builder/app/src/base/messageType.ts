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
	static AskIngredient:MessageType = new MessageType('AskIngredient', 3);
	static AnswerIngredient:MessageType = new MessageType('AnswerIngredient', 4);
	static ShowShortcuts:MessageType = new MessageType('ShowShortcuts', 5);
	static CreateStep:MessageType = new MessageType('CreateStep', 6);
	static Cancel:MessageType = new MessageType('CreateStep', 7);
	static AskMenu:MessageType = new MessageType('AskMenu', 8);
	static AnswerMenu:MessageType = new MessageType('AnswerMenu', 9);
	static AskText:MessageType = new MessageType('AskText', 10);
	static AnswerText:MessageType = new MessageType('AnswerText', 11);
	static AskQuantity:MessageType = new MessageType('AskQuantity', 12);
	static AnswerQuantity:MessageType = new MessageType('AnswerQuantity', 13);
};