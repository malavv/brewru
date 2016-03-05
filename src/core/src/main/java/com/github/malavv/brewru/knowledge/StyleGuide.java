package com.github.malavv.brewru.knowledge;

import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.Statement;
import com.hp.hpl.jena.vocabulary.RDF;

import java.util.List;

public final class StyleGuide {
  public static final String styleGuide = "https://github.com/malavv/brewru#styleGuide";

  private final Resource ref;
  private final List<Style> styles;
  private final List<StyleCategory> categories;

  public StyleGuide(final Model model, final Resource resource) {
    ref = resource;
    styles = ref.listProperties(model.getProperty("https://github.com/malavv/brewru#containsStyle"))
        .mapWith(Style::new)
        .toList();
    categories = ref.listProperties(model.getProperty("https://github.com/malavv/brewru#containsStyleCategory"))
        .mapWith(StyleCategory::new)
        .toList();
  }

  public static List<StyleGuide> listKnown(final Model model) {
    return model.listStatements(null, RDF.type, model.getResource(styleGuide))
        .mapWith(Statement::getSubject)
        .mapWith(styleGuide -> new StyleGuide(model, styleGuide))
        .toList();
  }

  public List<Style> getStyles() { return styles; }
  public List<StyleCategory> getCategory() { return categories; }
}
