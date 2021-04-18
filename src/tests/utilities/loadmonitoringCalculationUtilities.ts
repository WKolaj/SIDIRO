import { EnergyPoint } from "../../classes/CustomService/LoadmonitoringService";

export function CalulculatePredictedPowerAndEnergy(
  tickId: number,
  values: { [tickId: number]: { value: number } }[],
  multipliers: number[],
  powerLosses: number,
  intervalLength: number
): {
  predictedEnergy: number;
  predictedPower: number;
  historicalPoints: EnergyPoint[];
  predictedPoints: EnergyPoint[];
} {
  let intervalInMiliSeconds = intervalLength * 60000;
  let beginInterval = tickId - (tickId % intervalInMiliSeconds);
  let endInterval = beginInterval + intervalInMiliSeconds;

  let powerLossesPerStep = powerLosses / 60;

  const calculateEnergy = (tickIdToCalculate: number) => {
    let energy: number = 0;
    for (let i = 0; i < values.length; i++) {
      let valueOfTick = values[i][tickIdToCalculate].value * multipliers[i];
      energy += valueOfTick;
    }
    return energy;
  };

  const tickIdExists = (tickId: number) => {
    for (let value of values) {
      if (value[tickId] == null) return false;
    }
    return true;
  };

  let beginIntervalCounterState: number = calculateEnergy(beginInterval);

  let historicalPoints: EnergyPoint[] = [];
  let predictedPoints: EnergyPoint[] = [];

  let actualPoint = beginInterval;
  let intervalIndex: number = 0;
  while (actualPoint <= endInterval && tickIdExists(actualPoint)) {
    let energyConsumption =
      calculateEnergy(actualPoint) +
      intervalIndex * powerLossesPerStep -
      beginIntervalCounterState;

    historicalPoints.push({ tickId: actualPoint, value: energyConsumption });
    intervalIndex++;
    actualPoint = beginInterval + intervalIndex * 60000;
  }

  let firstPredictedPoint = historicalPoints[historicalPoints.length - 1];
  predictedPoints.push(firstPredictedPoint);

  let predictedEnergyConsumptionPerStep: number =
    historicalPoints[historicalPoints.length - 1].value -
    historicalPoints[historicalPoints.length - 2].value;

  let predictedIntervalIndex: number = 0;
  while (actualPoint <= endInterval) {
    predictedIntervalIndex++;
    predictedPoints.push({
      tickId: actualPoint,
      value:
        firstPredictedPoint.value +
        predictedIntervalIndex * predictedEnergyConsumptionPerStep,
    });
    actualPoint += 60000;
  }

  let predictedEnergy = predictedPoints[predictedPoints.length - 1].value;
  let predictedPower = (60 * predictedEnergy) / intervalLength;

  return {
    predictedEnergy,
    predictedPower,
    historicalPoints,
    predictedPoints,
  };
}
