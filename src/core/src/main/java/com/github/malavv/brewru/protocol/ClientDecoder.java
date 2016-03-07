package com.github.malavv.brewru.protocol;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.websocket.DecodeException;
import javax.websocket.Decoder;
import javax.websocket.EndpointConfig;
import java.io.StringReader;
import java.util.Collection;

public class ClientDecoder implements Decoder.Text<ClientDecoder.Request> {
  public static class Request {
    public final String type;
    public final String clientId;
    public final int id;

    public Request(String type, String clientId, int requestId) {
      this.type = type;
      this.clientId = clientId;
      this.id = requestId;
    }
  }

  @Override
  public Request decode(String s) throws DecodeException {
    try (JsonReader r = Json.createReader(new StringReader(s))) {
      JsonObject json = r.readObject();
      return new Request(
          json.getString("type"),
          json.getString("clientId"),
          json.getInt("id"));
    }
  }
  @Override public boolean willDecode(String s) { return true; }
  @Override public void init(EndpointConfig endpointConfig) { /* nop */ }
  @Override public void destroy() { /* nop */ }
}
