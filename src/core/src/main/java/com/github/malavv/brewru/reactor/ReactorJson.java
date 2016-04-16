package com.github.malavv.brewru.reactor;

import com.github.malavv.brewru.protocol.QtyJson;
import com.github.malavv.brewru.protocol.StepJson;

import java.util.List;

public class ReactorJson {
  public static class VesselJson {
    private String equipment;
    private QtyJson temp;
  }

  private List<StepJson> steps;
  private VesselJson vessel;

  public String getVessel() { return vessel.equipment; }
  public QtyJson getVesselTemp() { return vessel.temp; }
  public List<StepJson> getSteps() {
    return steps;
  }
}
