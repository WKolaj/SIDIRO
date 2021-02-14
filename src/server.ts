import { MindSphereFileService } from "./classes/MindSphereService/MindSphereFileService";
import { snooze } from "./utilities/utilities";
import { FileDataStorage } from "./classes/DataStorage/FileDataStorage";
import { MindSphereDataStorage } from "./classes/DataStorage/MindSphereDataStorage";
import { MindSphereEventService } from "./classes/MindSphereService/MindSphereEventService";
import { MindSphereTokenManager } from "./classes/MindSphereService/MindSphereToken/MindSphereTokenManager";
import {
  MindSphereAsset,
  MindSphereAssetService,
} from "./classes/MindSphereService/MindSphereAssetService";

let exec = async () => {
  let assetService = MindSphereAssetService.getInstance();

  let asset: MindSphereAsset = {
    name: "fakeAssetUpdated",
    parentId: "a2d64d87a94a41609db73f5fe50c4ae8",
    typeId: "core.basicarea",
  };

  // //let result = await assetService.createAsset(asset);
  // let result = await assetService.getAsset("052aa269f32642aaa4511133cf4a9e14");

  // result.name = "updateAsset";

  let result2 = await assetService.updateAsset(
    "052aa269f32642aaa4511133cf4a9e14",
    asset
  );

  console.log(result2);

  // let allNames = await MindSphereFileService.getInstance().getAllFileNamesOfAsset(
  //   "901af6c8a39f45d78c21e014136b11c9",
  //   "json"
  // );
  // console.log(allNames);

  // let storage = new FileDataStorage<TestContent>("__testDir");

  // await MindSphereTokenManager.getInstance().fetchNewToken();

  // let startDate = Date.now();

  // let response = await MindSphereFileService.getInstance().getAllFileNamesFromAsset(
  //   "a5eebd59cd1348c5b38f8d74ab432780",
  //   "json"
  // );

  // await storage.setData("myUser", {
  //   field1: "123",
  //   field2: "567",
  //   field3: 2134,
  // });

  // await storage.fetchAllData();

  // let stop = Date.now();

  // console.log((stop - start) / 1000);

  // console.log((storage as any)._cacheData);

  // await storage.setData("testData2", {
  //   field1: "testData1",
  //   field2: "testData2",
  //   field3: 1235,
  // });

  // let data = await storage.getData("testData2");

  // console.log(data);

  // for (let i = 0; i < 300; i++) {
  //   let fileName = `testFile_${i}.json`;
  //   let fileContent = { abcd: `test123_${i}`, dcba: `test321_${i}` };
  //   await fileService.setFileContent(
  //     "901af6c8a39f45d78c21e014136b11c9",
  //     fileName,
  //     fileContent
  //   );
  //   console.log(`Created ${i + 1} of ${300}`);
  // }
};

exec();
