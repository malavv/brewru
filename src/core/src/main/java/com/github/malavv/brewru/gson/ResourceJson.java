package com.github.malavv.brewru.gson;

import com.github.malavv.brewru.onto.Brew;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.ResourceFactory;

import java.io.IOException;

public class ResourceJson extends TypeAdapter<Resource> {
  @Override
  public void write(JsonWriter out, Resource value) throws IOException {
    out.value((value.getNameSpace().equals(Brew.getNs()) ? Brew.getPrefix() : "unknown:") + value.getLocalName());
  }

  @Override
  public Resource read(JsonReader in) throws IOException {
    return ResourceFactory.createResource(Brew.getNs() + in.nextString().split(":")[1]);
  }
}
