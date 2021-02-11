import { MindSphereFileService } from "./classes/MindSphereService/MindSphereFileService";
import { snooze } from "./utilities/utilities";
import { FileDataStorage } from "./classes/DataStorage/FileDataStorage";

let exec = async () => {
  type TestContent = {
    field1: string;
    field2: string;
    field3: number;
  };

  let storage = new FileDataStorage<TestContent>("__testDir");

  await storage.setData("testData2", {
    field1: "testData1",
    field2: "testData2",
    field3: 1235,
  });

  let data = await storage.getData("testData2");

  console.log(data);

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
