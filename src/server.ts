// import appStart from "./startup/app";

import CustomServiceManager, {
  CustomServiceType,
} from "./classes/CustomService/CustomServiceManager";
import LoadmonitoringService, {
  LoadmonitoringConfig,
} from "./classes/CustomService/LoadmonitoringService";
import Sampler from "./classes/Sampler/Sampler";

// export default appStart(__dirname);

let exec = async () => {
  //   let loadmonitoringServicePayload: LoadmonitoringConfig = {
  //     appId: "ten-sidivp-sub-4147f8f83d49a609943fa8875f9ae89b",
  //     plantId: "zimna-wodka-plant",
  //     sampleTime: 60,
  //     serviceType: CustomServiceType.LoadmonitoringService,
  //     enabled: true,
  //     tenant: "sidivp",
  //     assetIds: [
  //       {
  //         assetId: "453abff100514e52ab7d29542b550271",
  //         aspectId: "DATA_1_MIN",
  //         variableName: "Active_Energy_Import",
  //         multiplier: 0.001,
  //       },
  //     ],
  //     powerLosses: 10,
  //     alertLimit: 250,
  //     warningLimit: 200,
  //     mailingList: ["wkolaj@gmail.com", "witold.kolaj@siemens.com"],
  //     interval: 15,
  //   };

  let serviceManager = CustomServiceManager.getInstance();

  await serviceManager.init();
};

exec();
