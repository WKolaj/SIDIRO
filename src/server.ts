import {
  MindSphereTimeSeriesService,
  TimeSeriesData,
} from "./classes/MindSphereService/MindSphereTimeSeriesService";

let exec = async () => {
  let timeSeriesService = MindSphereTimeSeriesService.getInstance();

  let result = await timeSeriesService.getValues(
    "da3d417b1d41459c821403a630b5407d",
    "devInfo",
    1611168783033,
    1612032783033
  );

  console.log(result);

  let result2 = await timeSeriesService.getLastValues(
    "da3d417b1d41459c821403a630b5407d",
    "devInfo"
  );

  console.log(result2);

  // await timeSeriesService.deleteValues(
  //   "da3d417b1d41459c821403a630b5407d",
  //   "devInfo",
  //   1611100800000 - 24 * 60 * 60 * 1000,
  //   1611187200000 - 24 * 60 * 60 * 1000
  // );

  let date = Date.now();

  let dataToSet: TimeSeriesData = {
    memoryUsage: {
      [date - 2000]: {
        value: 31,
        qc: 0,
      },
      [date - 1000]: {
        value: 32,
        qc: 0,
      },
      [date]: {
        value: 33,
        qc: 0,
      },
    },
    processMemory: {
      [date - 2000]: {
        value: 10,
        qc: 0,
      },
      [date - 1000]: {
        value: 11,
        qc: 0,
      },
    },
    temperature: {
      [date - 2000]: {
        value: 41,
        qc: 0,
      },
      [date - 1000]: {
        value: 42,
        qc: 0,
      },
      [date]: {
        value: 43,
        qc: 0,
      },
    },
    cpuUsage: {
      [date - 2000]: {
        value: 51,
        qc: 0,
      },
      [date - 1000]: {
        value: 52,
        qc: 0,
      },
      [date]: {
        value: 53,
        qc: 0,
      },
    },
  };

  await timeSeriesService.setValues(
    "da3d417b1d41459c821403a630b5407d",
    "devInfo",
    dataToSet
  );
};

exec();
