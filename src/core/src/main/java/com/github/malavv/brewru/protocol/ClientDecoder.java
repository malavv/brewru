package com.github.malavv.brewru.protocol;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import javax.websocket.DecodeException;
import javax.websocket.Decoder;
import javax.websocket.EndpointConfig;

public class ClientDecoder implements Decoder.Text<ClientDecoder.Request> {
  public static class Request {
    public final String type;
    public final String clientId;
    public final int id;
    public final JsonElement data;

    public Request(String type, String clientId, int requestId, JsonElement data) {
      this.type = type;
      this.clientId = clientId;
      this.id = requestId;
      this.data = data;
    }
  }

  @Override
  public Request decode(String s) throws DecodeException {
    JsonElement raw = new JsonParser().parse(s);
    if (!raw.isJsonObject())
      throw new DecodeException(s, "Not an object");
    JsonObject json = raw.getAsJsonObject();
    if (!json.has("type") || !json.has("clientId") || !json.has("id"))
      throw new DecodeException(s, "Missing Required Property");
    return new Request(
      json.get("type").getAsString(),
      json.get("clientId").getAsString(),
      json.get("id").getAsInt(),
      json.get("data")
    );
  }
  @Override public boolean willDecode(String s) { return true; }
  @Override public void init(EndpointConfig endpointConfig) { /* nop */ }
  @Override public void destroy() { /* nop */ }
}
