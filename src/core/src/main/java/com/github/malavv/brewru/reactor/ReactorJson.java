package com.github.malavv.brewru.reactor;

import com.github.malavv.brewru.protocol.StepJson;

import java.util.List;

public class ReactorJson {
  private List<StepJson> steps;
  private String equipment;

  public String getEquipment() {
    return equipment;
  }

  public List<StepJson> getSteps() {
    return steps;
  }
}
