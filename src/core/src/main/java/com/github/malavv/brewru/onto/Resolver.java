package com.github.malavv.brewru.onto;

import com.github.malavv.brewru.BrewruServer;
import com.google.common.collect.BiMap;
import com.google.common.collect.ImmutableBiMap;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.Resource;

import java.util.Optional;
import java.util.logging.Logger;

public final class Resolver {
  /**
   * Retrieves the short form encoding of this resource.
   * @param res Resource to resolve.
   * @return Short form (ex. brewru:tapWater)
   */
  public static String getShort(Resource res) {
    return shortForm(resolveNamespace(res.getNameSpace()), res.getLocalName());
  }

  /**
   * Resolve a short form to an RDF Resource that is in the KB.
   *
   * This means there must be a known KB. (not static init)
   * @param shortForm Short form version of the resource (ex. brewru:tapWater)
   * @return Optionally returning the resource.
   */
  public static Optional<Resource> fromShort(String shortForm) {
    return shortForm != null
        ? resolveResource(shortForm.split(separator))
        : Optional.empty();
  }

  private static final BiMap<String, String> prefixes = ImmutableBiMap.of("brewru", Brew.getNs());
  private static final String errorNamespace = "unknown";
  private static final String separator = ":";

  private static String shortForm(String ns, String local) {
    return ns + separator + local;
  }
  private static String resolveNamespace(String ns) {
    return prefixes.inverse().getOrDefault(ns, errorNamespace);
  }
  private static Optional<Resource> resolveResource(String[] tokens) {
    if (tokens.length != 2)
      return Optional.empty();
    Model kb = BrewruServer.getKB();
    if (kb == null) {
      Logger.getLogger("Resolver").warning("No KB for resolving.");
      return Optional.empty();
    }
    return Optional.ofNullable(prefixes.get(tokens[0])).map(n -> kb.getResource(n + tokens[1]));
  }

  private Resolver() {}
}
