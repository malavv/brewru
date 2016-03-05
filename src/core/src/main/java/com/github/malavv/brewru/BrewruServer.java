package com.github.malavv.brewru;

import com.github.malavv.brewru.knowledge.StyleGuide;
import com.hp.hpl.jena.rdf.model.*;
import com.hp.hpl.jena.vocabulary.RDF;
import com.hp.hpl.jena.vocabulary.RDFS;
import org.glassfish.tyrus.server.Server;

import javax.websocket.DeploymentException;
import java.util.List;
import java.util.logging.Logger;

public class BrewruServer {

  public static Thread t;

  public static final String ns = "https://github.com/malavv/brewru#";

  public static void main(String[] args) {
    Model model = ModelFactory.createDefaultModel();
    model.read(BrewruServer.class.getClassLoader().getResourceAsStream("brewru.owl"), null, "TTL");

    StyleGuide.listKnown(model)
        .forEach(guide -> {
          guide.getStyles().stream().forEach(System.out::println);
          guide.getCategory().stream().forEach(System.out::println);
        });

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