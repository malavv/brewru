package com.github.malavv.brewru;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

/**
 * Provides the restful api which will be offered to clients.
 * <p>
 * When there will be lots more functionalities it would make sense to split this class into multiple one, but not for
 * the moment.
 */
@Path("connect")
public class RestApi {
  public static final String CONNECTION_MSG = "Connection Successful";

  @GET
  @Path("connect")
  @Produces("text/plain")
  public String testConnection() {
    return CONNECTION_MSG;
  }
}
