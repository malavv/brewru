class Shortcut {
	binding: string;
	name: string;
	intent: MessageType;
}

class Shortcuts {
	public all: Array<Shortcut> = [];
	public map: { [map: string]: Shortcut; } = {}
	
	add(binding: string, name: string, intent: MessageType) {
	    var newShortcut:Shortcut = {
	      binding: binding,
	      name: name,
	      intent: intent
	    };
	    this.all.push(newShortcut);
	    this.map[binding] = newShortcut;
	    return this;
	}
	
	public static default: Shortcuts = new Shortcuts()
	    .add('alt+S', 'Create new step', MessageType.CreateStep)
	    .add('shift+6', 'Toggle Visibility of Shortcuts', MessageType.ShowShortcuts)
	    .add('esc', 'Cancel current action.', MessageType.Cancel);
}