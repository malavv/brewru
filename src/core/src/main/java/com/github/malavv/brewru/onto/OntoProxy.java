package com.github.malavv.brewru.onto;

import com.hp.hpl.jena.ontology.OntModel;
import org.semanticweb.owlapi.apibinding.OWLManager;
import org.semanticweb.owlapi.model.IRI;
import org.semanticweb.owlapi.model.OWLOntologyCreationException;
import org.semanticweb.owlapi.model.OWLOntologyManager;
import org.semanticweb.owlapi.util.CommonBaseIRIMapper;

import java.io.File;

public class OntoProxy {
  public OntModel m;

  public OntoProxy() {
    String directory = "C:/src/brewru/onto";
    String malavv = "http://brewru.com/malavv";
    String brew = "http://github.com/malavv/brewru";

    OWLOntologyManager manager = OWLManager.createOWLOntologyManager();
    CommonBaseIRIMapper iriMapper = new CommonBaseIRIMapper(IRI.create(new File(directory).toURI()));

    iriMapper.addMapping(IRI.create(brew), "brewru.owl");
    iriMapper.addMapping(IRI.create(malavv), "brewru-user-example.owl");

    manager.addIRIMapper(iriMapper);
    try {
      manager.loadOntologyFromOntologyDocument(iriMapper.getDocumentIRI(IRI.create(malavv)));
    } catch (OWLOntologyCreationException e) {
      e.printStackTrace();
    }
    System.out.println();
  }
}
