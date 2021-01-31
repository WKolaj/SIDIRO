import { MindSphereFileService } from "./classes/MindSphereService/MindSphereFileService";
import { snooze } from "./utilities/utilities";

let exec = async () => {
  let fileService = MindSphereFileService.getInstance();

  // let result = await fileService.checkIfFileExists(
  //   "da3d417b1d41459c821403a630b5407d",
  //   "testFile.json"
  // );
  // console.log(result);

  // await fileService.deleteFile(
  //   "da3d417b1d41459c821403a630b5407d",
  //   "testFile2.json"
  // );

  await fileService.setFileContent(
    "da3d417b1d41459c821403a630b5407d",
    "testFile2.json",
    {
      abcd: 1234,
    }
  );

  await snooze(10000);
  console.log(1);

  await fileService.setFileContent(
    "da3d417b1d41459c821403a630b5407d",
    "testFile2.json",
    {
      abcd: 1235,
    }
  );

  await snooze(10000);
  console.log(2);

  await fileService.setFileContent(
    "da3d417b1d41459c821403a630b5407d",
    "testFile2.json",
    {
      abcd: 1236,
    }
  );

  await snooze(10000);
  console.log(3);

  let result = await fileService.getFileContent(
    "da3d417b1d41459c821403a630b5407d",
    "testFile2.json"
  );

  console.log(result);
};

exec();
