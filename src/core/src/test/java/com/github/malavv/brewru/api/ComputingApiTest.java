package com.github.malavv.brewru.api;

import com.github.malavv.brewru.BrewruServer;
import com.github.malavv.brewru.SocketApi;
import com.github.malavv.brewru.protocol.ClientDecoder;
import com.github.malavv.brewru.protocol.StepJson;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.io.InputStreamReader;

public class ComputingApiTest {
  private Gson gson;

  @BeforeMethod
  public void setUp() throws Exception {
    this.gson = new GsonBuilder()
        .registerTypeAdapter(StepJson.class, new StepJson.Adapter())
        .create();
    BrewruServer.init();
  }

  @Test
  public void testComputeRecipe() throws Exception {
    JsonElement s = ComputingApi.computeRecipe(new SocketApi.Pkg(new ClientDecoder.Request(null, null, -1, getJsonRes("simpleRecipe.json")), null, gson));
  }

  private static JsonElement getJsonRes(final String url) {
    return new JsonParser().parse(new InputStreamReader(ComputingApiTest.class.getClassLoader().getResourceAsStream(url)));
  }
}