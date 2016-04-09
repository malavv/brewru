package com.github.malavv.brewru;

import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import org.glassfish.tyrus.server.Server;

import javax.websocket.DeploymentException;
import java.util.logging.Logger;

public class BrewruServer {
  private static Model kb;

  public static Model getKB() { return kb; }
  public static Thread t;

  public static void main(String[] args) {
    BrewruServer.kb = ModelFactory.createDefaultModel();
    BrewruServer.kb.read(BrewruServer.class.getClassLoader().getResourceAsStream("brewru.owl"), null, "TTL");

    Server server = new Server("localhost", 8025, "/", null, SocketApi.class);
    t = Thread.currentThread();
    try {
      server.start();
      // Infinite wait until other thread interrupt us.
      Object o = new Object();
      synchronized (o) { o.wait(); }
    } catch (DeploymentException e) {
      e.printStackTrace();
    } catch (InterruptedException e) {
      Logger.getGlobal().info("Server being shutdown.");
    } finally {
      server.stop();
    }
  }
}