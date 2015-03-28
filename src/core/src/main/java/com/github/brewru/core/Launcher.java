package com.github.brewru.core;

import com.hp.hpl.jena.ontology.*;
import com.hp.hpl.jena.rdf.model.*;
import com.hp.hpl.jena.ontology.OntModelSpec;


import java.io.*;
import java.util.Iterator;
import java.util.function.Predicate;

public class Launcher {
    public static void main(String[] args) {
    	Predicate<String> pred = (s) -> s.length() > 0;
    	System.out.print("Brewru");

    	String SOURCE = "http://github.com/malavv/brewru";
		String NS = SOURCE + "#";
		OntModel base = ModelFactory.createOntologyModel(OntModelSpec.OWL_MEM_MICRO_RULE_INF);

		// create a dummy paper for this example
		OntClass paper = base.createClass(NS + "Paper");
		Individual p1 = base.createIndividual( NS + "paper1", paper );

		// list the asserted types
		for (Iterator<Resource> i = p1.listRDFTypes(false); i.hasNext(); ) {
			System.out.println( p1.getURI() + " is asserted in class " + i.next() );
		}

		// list the inferred types
		p1 = base.getIndividual( NS + "paper1" );
		for (Iterator<Resource> i = p1.listRDFTypes(false); i.hasNext(); ) {
			System.out.println( p1.getURI() + " is inferred to be in class " + i.next() );
		}

			base.write(System.out, "TTL");
    }
}
