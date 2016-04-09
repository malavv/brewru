package com.github.malavv.brewru.knowledge;

import com.github.malavv.brewru.onto.KBConcept;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.Property;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.Statement;

import java.util.Collection;

public class StyleCategory extends KBConcept {
  private final String code;
  private final Collection<Style> styles;

  public StyleCategory(Model model, Statement statement) {
    super(statement.getResource());

    Property codeProperty = model.getProperty("https://github.com/malavv/brewru#", "code");
    code = ref.getProperty(codeProperty).getString();
    styles = ref.listProperties(model.getProperty("https://github.com/malavv/brewru#hasStyle"))
        .mapWith(sc -> new Style(model, sc))
        .toList();
  }

  public String getShortForm() {
    return "brewru:" + ref.getLocalName();
  }
  public String getCode() { return code; }
  public Collection<Style> getStyles() {
    return styles;
  }
}
