package com.github.malavv.brewru;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.io.IOException;
import java.net.Socket;

/**
 * Entry point of the application.
 * <p>
 * This is were each class providing resource that needs to be managed by Tomcat are listed here.
 */
@ApplicationPath("/")
public class App extends Application {

  /**
   * Will contact Tomcat and request an application shutdown.
   *
   * @return True if error
   */
  public static boolean shutdown() {
    try (Socket clientSocket = new Socket("localhost", 8005)) {
      clientSocket.getOutputStream().write("SHUTDOWN".getBytes());
      clientSocket.getOutputStream().close();
      clientSocket.close();
      return false;
    } catch (IOException e) {
      e.printStackTrace();
      System.err.print("[FATAL] Error in trying to shutdown the server.");
      return true;
    }
  }
}
