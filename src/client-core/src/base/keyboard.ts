class Keyboard {
	private event: KeyboardEvent;
	binding: string;
	
	constructor(event:KeyboardEvent) {
		this.event = event;
		this.binding = Keyboard.getKeyBinding(event);
	}
	
	toString(): string {
		return this.binding;
	}
	
	static fromEvt(event:KeyboardEvent): Keyboard {
		return new Keyboard(event);
	}
	static getKeyBinding(event:KeyboardEvent) : string {
		var binding:Array<string> = [];
		
		if (event.altKey) binding.push('alt');
    	if (event.ctrlKey) binding.push('ctrl');
		if (event.metaKey) binding.push('meta');
    	if (event.shiftKey) binding.push('shift');
		binding.push(this.getCodeName(event.which));
		return binding.join('+');
	}
	static getCodeName(code:number) : string {
		if (code >= 33 && code <= 126) return String.fromCharCode(code);
		switch (code) {
			case  8: return 'backspace';
			case 13: return 'enter';
			case 16: return 'shift'; /** Shift only */
			case 18: return 'shift'; /** Alt   only */
			case 27: return 'esc';
			case 32: return 'space';
			default:
				console.warn('[Keyboard]getCodeName: Unknown Code Name :', code);
				return 'unknwon';
		}
	}
}