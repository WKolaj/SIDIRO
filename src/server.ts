import { MindSphereTimeSeriesService } from "./classes/MindSphereService/MindSphereTimeSeriesService";
import { snooze } from "./utilities/utilities";

let exec = async () => {
  let timeSeriesService = MindSphereTimeSeriesService.getInstance();
  try {
    let fromDate = new Date("2021-02-07T00:00:00.000Z").getTime();
    let toDate = new Date("2021-02-07T00:00:10.000Z").getTime();
    let result = await timeSeriesService.getValues(
      "a5eebd59cd1348c5b38f8d74ab432780",
      "1F1_1_s",
      fromDate,
      toDate
    );

    console.log(Object.keys(Object.values(result)[0]).length);

    // console.log("Before:");
    // console.log(result);
    // console.log(result.length);

    // for (let i = 0; i < 100; i++) {
    //   let eventToSend: MindSphereStandardEvent = {
    //     timestamp: new Date().toISOString(),
    //     entityId: "901af6c8a39f45d78c21e014136b11c9",
    //     severity: 30,
    //     description: "Test description " + i,
    //     code: "1234",
    //     source: "Test source",
    //   };
    //   await eventService.postEvent(eventToSend);

    //   await snooze(100);
    //   console.log("send " + i);
    // }

    // let result2 = await eventService.getEvents(
    //   "901af6c8a39f45d78c21e014136b11c9",
    //   fromDate,
    //   toDate
    // );

    // console.log("After:");
    // console.log(result2);

    // let fromDate = new Date("2019-10-05T14:48:00.000Z").getTime();
    // let toDate = new Date("2021-10-05T14:48:00.000Z").getTime();

    // let result = await eventService.getEvents(
    //   "a5eebd59cd1348c5b38f8d74ab432780",
    //   fromDate,
    //   toDate
    // );

    // console.log(result);
    // console.log(result.length);
  } catch (err) {
    console.log(err);
  }
};

exec();
