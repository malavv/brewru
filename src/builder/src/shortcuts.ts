class Shortcut {
	binding: string;
	name: string;
	intent: string;
}

class Shortcuts {
	all: Array<Shortcut>;
	map: { [map: string]: Shortcut; };
	
	add(binding: string, name: string, intent: string) {
	    var newShortcut:Shortcut = {
	      binding: binding,
	      name: name,
	      intent: intent
	    };
	    this.all.push(newShortcut);
	    this.map[binding] = newShortcut;
	    return this;
	}
	
	static default: Shortcuts = new Shortcuts()
	    .add('alt+S', 'Create new step', 'CreateStep')
	    .add('shift+6', 'Toggle Visibility of Shortcuts', 'Shortcuts')
	    .add('esc', 'Cancel current action.', 'Cancel');
}