package com.github.malavv.brewru.protocol;

import com.google.gson.TypeAdapter;

import java.util.List;

public class ComputationData {
  public static class Step {
    public int reac;
    public List<Float> prop;
    public List<Float> sub;
  }
  public List<String> substance;
  public List<String> reactors;
  public List<String> properties;
  public List<Step> steps;
}
