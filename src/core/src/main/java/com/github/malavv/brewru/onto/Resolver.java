package com.github.malavv.brewru.onto;

import com.github.malavv.brewru.BrewruServer;
import com.google.common.collect.BiMap;
import com.google.common.collect.ImmutableBiMap;
import com.hp.hpl.jena.rdf.model.Resource;

import java.util.Optional;

public final class Resolver {
  private static final BiMap<String, String> prefixes = ImmutableBiMap.of(
      "brewru", Brew.getNs()
  );

  public static String getShort(Resource resource) {
    return prefixes.inverse().getOrDefault(resource.getNameSpace(), "unknown") + ":" + resource.getLocalName();
  }

  public static Optional<Resource> fromShort(String shortForm) {
    if (shortForm == null || shortForm.isEmpty())
      return Optional.empty();
    String[] tokens = shortForm.split(":");
    if (tokens.length != 2)
      return Optional.empty();
    return Optional.of(BrewruServer.getKB().getResource(prefixes.getOrDefault(tokens[0], "http://example.org#") + tokens[1]));
  }

  private Resolver() {}
}
