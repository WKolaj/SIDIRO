import {
  MindSphereEventService,
  MindSphereStandardEvent,
} from "./classes/MindSphereService/MindSphereEventService";
import { snooze } from "./utilities/utilities";

let exec = async () => {
  let eventService = MindSphereEventService.getInstance();
  try {
    // let fromDate = new Date("2020-10-05T14:48:00.000Z").getTime();
    // let toDate = new Date("2021-10-05T14:48:00.000Z").getTime();
    // let result = await eventService.getEvents(
    //   "901af6c8a39f45d78c21e014136b11c9",
    //   fromDate,
    //   toDate
    // );

    // console.log("Before:");
    // console.log(result);

    // for (let i = 0; i < 10; i++) {
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

    let result = await eventService.getEvent(
      "2e4f6c9b-9144-44fc-8bfc-6733dd893bbf"
    );
    console.log(result);
  } catch (err) {
    console.log(err);
  }
};

exec();
