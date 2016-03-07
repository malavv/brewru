package com.github.malavv.brewru.knowledge;

import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.Property;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.Statement;

public class Style {
  private final Resource ref;
  private final String code;

  public Style(Model model, Statement statement) {
    ref = statement.getResource();
    Property codeProperty = model.getProperty("https://github.com/malavv/brewru#", "code");
    this.code = ref.getProperty(codeProperty).getString();
  }
  public String getShortForm() {
    return "brewru:" + ref.getLocalName();
  }
  public String getCode() { return code; }
}
