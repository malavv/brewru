package com.github.malavv.brewru.api;

import com.github.malavv.brewru.BrewruServer;
import com.github.malavv.brewru.SocketApi;
import com.github.malavv.brewru.knowledge.Equipment;
import com.github.malavv.brewru.knowledge.Ingredient;
import com.github.malavv.brewru.knowledge.Unit;
import com.github.malavv.brewru.onto.Resolver;
import com.github.malavv.brewru.protocol.ClientDecoder;
import com.github.malavv.brewru.protocol.StepJson;
import com.github.malavv.brewru.reactor.BasicReactor;
import com.github.malavv.brewru.reactor.Reactor;
import com.github.malavv.brewru.reactor.Substance;
import com.github.malavv.brewru.unit.Quantity;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.hp.hpl.jena.rdf.model.Model;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.io.InputStreamReader;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

public class ComputingApiTest {
  private Gson gson;
  private Model kb;

  private Equipment.Vessel kettle65;
  private Unit litre;
  private Unit celsius;
  private Ingredient tapWater;
  private Quantity celsius22;
  private Quantity litre22;
  private Substance distilledWater;

  @BeforeMethod
  public void setUp() throws Exception {
    this.gson = new GsonBuilder()
        .registerTypeAdapter(StepJson.class, new StepJson.Adapter())
        .create();
    BrewruServer.init();

    kb = BrewruServer.getKB();
    litre = Unit.from(Resolver.fromShort("brewru:litre").get()).get();
    celsius = Unit.from(Resolver.fromShort("brewru:celsius").get()).get();
    tapWater = Ingredient.from(Resolver.fromShort("brewru:tapwater").get()).get();
    kettle65 = (Equipment.Vessel) Equipment.fromKB(Resolver.fromShort("brewru:kettle_6.5").get(), kb, Equipment.Type.Vessel).get();

    celsius22 = new Quantity(22, celsius);
    litre22 = new Quantity(23, litre);

    distilledWater = Substance.from(Resolver.fromShort("brewru:distilledWater").get()).get();
  }

  @Test
  public void testSimplestRecipe() throws Exception {
    Reactor reactor = new BasicReactor(kettle65, celsius22);
    assertEquals(reactor.getVessel(), kettle65);
    assertEquals(reactor.getSubstances().count(), 0);
    assertEquals(reactor.getNumOfMinutes(), 0);
    assertEquals(reactor.getData().size(), 0);
    assertTrue(Quantity.epsilonEquals(reactor.getTemperature(0), celsius22, 0.2), "Temperature is not equal");
    assertEquals(reactor.getPh(0), Double.NaN);
    assertEquals(reactor.getVolume(0).magnitude, 0.0, 0.01);
  }

  @Test
  public void testOnlyWaterRecipe() throws Exception {
    // Actions
    Reactor reactor = new BasicReactor(kettle65, celsius22);
    reactor.addition(tapWater, litre22, celsius22);

    // Testing
    assertTrue(reactor.getSubstances().count() > 0, "Must contain a substance");
    assertTrue(reactor.getSubstanceIdx(distilledWater).isPresent(), "Must have distilled water as one of the substance");
    assertEquals(reactor.getNumOfMinutes(), 1, "Must have at least 1 min, since the addition is 1 min");

    Double molesOfWater = reactor.getData().get(0)[reactor.getSubstanceIdx(distilledWater).get()];

    assertEquals(molesOfWater, 1274, 0.5, "Quantity of distilled water added");
    assertEquals(reactor.getTemperature(0).magnitude, 295.15, 0.01, "Temperature of water after addition");
    assertEquals(reactor.getPh(0), 7.0, 0.1, "PH of the reactor after water addition");
    assertEquals(reactor.getVolume(0).magnitude, 0.023, 0.0005, "Volume of the reactor");
  }

  @Test
  public void testComputeRecipe() throws Exception {
    JsonElement s = ComputingApi.computeRecipe(new SocketApi.Pkg(new ClientDecoder.Request(null, null, -1, getJsonRes("simpleRecipe.json")), null, gson));
  }

  private static JsonElement getJsonRes(final String url) {
    return new JsonParser().parse(new InputStreamReader(ComputingApiTest.class.getClassLoader().getResourceAsStream(url)));
  }
}