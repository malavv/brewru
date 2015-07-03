/// <reference path="base/keyboard.ts" />

/**
 * Defines a shortcut with a possible binding.
 *
 * Used to bind a certain key combination with a SubPub message.
 */
class Shortcut {
  /** A string representing the key combination. */
  public binding:string;
  /** Basic description of the action expected. less than 80 char. */
  public description:string;
  /** The message that will be sent on event. */
  public intent:MessageType;
}

/**
 * Manager of shortcuts, no method is static. Use default for main instance.
 */
class Shortcuts {
  /** List of all bound Shortcuts. */
  public all:Array<Shortcut> = [];
  /** Map of binding to Shortcut. */
  public map:{ [map: string]: Shortcut; } = {}

  public hasKey(key:Keyboard):boolean {
    return this.map[key.toString()] !== undefined;
  }

  public get(key:Keyboard):Shortcut {
    return this.map[key.toString()];
  }

  /** Chainable method to add a Shortcut to this manager. */
  add(binding:string, intent:MessageType, description:string) {
    var newShortcut:Shortcut = {
      binding: binding,
      description: description,
      intent: intent
    };
    this.all.push(newShortcut);
    this.map[binding] = newShortcut;
    return this;
  }
}
