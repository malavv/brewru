package com.github.malavv.brewru.protocol;

import com.github.malavv.brewru.reactor.ReactorJson;

import java.util.List;

public class RecipeJson {
  private String ref;
  private String name;
  private String description;
  private String style;
  private List<ReactorJson> reactors;

  public List<ReactorJson> getReactors() {
    return reactors;
  }
}
