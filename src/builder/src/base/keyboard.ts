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
		var binding = '';
		if (event.altKey) binding += 'alt';
    	if (event.ctrlKey) binding += 'ctrl';
		if (event.metaKey) binding += 'meta';
    	if (event.shiftKey) binding += 'shift';
		binding += '+' + this.getCodeName(event.which);
		return binding;
	}
	static getCodeName(code:number) : string {
		if (code >= 33 && code <= 126) return String.fromCharCode(code);
		switch (code) {
			case 13: return 'enter';
			case 16: return 'shift'; /** Shift only */
			case 27: return 'esq';
			default:
				console.warn('[Keyboard]getCodeName: Unknown Code Name :', code);
				return 'unknwon';
		}
	}
}