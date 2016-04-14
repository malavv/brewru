package com.github.malavv.brewru.knowledge;

import com.github.malavv.brewru.onto.KBConcept;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.Property;
import com.hp.hpl.jena.rdf.model.Statement;

public class Style extends KBConcept {
  private final String code;

  public Style(Model model, Statement statement) {
    super(statement.getResource());
    Property codeProperty = model.getProperty("https://github.com/malavv/brewru#", "code");
    this.code = ref.getProperty(codeProperty).getString();
  }

  public String getShortForm() {
    return "brewru:" + ref.getLocalName();
  }
  public String getCode() { return code; }
}
