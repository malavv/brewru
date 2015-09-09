package com.github.malavv.brewru.onto;

import org.semanticweb.owlapi.apibinding.OWLManager;
import org.semanticweb.owlapi.model.IRI;
import org.semanticweb.owlapi.model.OWLOntology;
import org.semanticweb.owlapi.model.OWLOntologyCreationException;
import org.semanticweb.owlapi.model.OWLOntologyManager;
import org.semanticweb.owlapi.util.CommonBaseIRIMapper;

import java.io.File;

public class OntoProxy {

  public OWLOntology ontology;

  public OntoProxy() {
    OWLOntologyManager manager = OWLManager.createOWLOntologyManager();

    IRI userOnto = IRI.create("http://brewru.com/malavv");
    IRI domainOnto = IRI.create("http://github.com/malavv/brewru");
    File ontoFolder = new File("C:/src/brewru/onto/");

    CommonBaseIRIMapper map = new CommonBaseIRIMapper(IRI.create(ontoFolder));
    map.addMapping(domainOnto, "brewru.owl");
    map.addMapping(userOnto, "brewru-user-example.owl");
    manager.addIRIMapper(map);

    try {
      ontology = manager.loadOntology(userOnto);
    } catch (OWLOntologyCreationException e) {
      e.printStackTrace();
    }
  }
}
