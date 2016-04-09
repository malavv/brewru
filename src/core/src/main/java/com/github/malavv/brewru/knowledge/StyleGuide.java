package com.github.malavv.brewru.knowledge;

import com.github.malavv.brewru.gson.ResourceJson;
import com.github.malavv.brewru.onto.Brew;
import com.github.malavv.brewru.onto.KBConcept;
import com.google.gson.annotations.JsonAdapter;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.ResourceFactory;
import com.hp.hpl.jena.rdf.model.Statement;
import com.hp.hpl.jena.vocabulary.RDF;

import java.util.List;

public final class StyleGuide extends KBConcept {
  private final List<Style> styles;
  private final List<StyleCategory> categories;
  private final int year;
  @JsonAdapter(ResourceJson.class)
  private final Resource org;

  public StyleGuide(final Model model, final Resource resource) {
    super(resource);
    year = 2015;
    org = model.getResource("https://github.com/malavv/brewru#bjcp");
    styles = ref.listProperties(model.getProperty("https://github.com/malavv/brewru#containsStyle"))
        .mapWith(s -> new Style(model, s))
        .toList();
    categories = ref.listProperties(model.getProperty("https://github.com/malavv/brewru#containsStyleCategory"))
        .mapWith(sc -> new StyleCategory(model, sc))
        .toList();
  }

  public static List<StyleGuide> getAll(final Model model) {
    return model.listStatements(null, RDF.type, Brew.styleGuide)
        .mapWith(Statement::getSubject)
        .mapWith(styleGuide -> new StyleGuide(model, styleGuide))
        .toList();
  }

  public int getYear() {
    return year;
  }

  public String getOrgShortForm() {
    return "brewru:" + org.getLocalName();
  }

  public List<Style> getStyles() { return styles; }

  public List<StyleCategory> getCategory() { return categories; }

  public String getShortForm() {
    return "brewru:" + ref.getLocalName();
  }
}
