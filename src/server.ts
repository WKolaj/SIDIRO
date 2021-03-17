// import appStart from "./startup/app";

// export default appStart(__dirname);

import { MindSphereApp } from "./classes/MindSphereApp/MindSphereApp";
import { MindSphereUserService } from "./classes/MindSphereService/MindSphereUserService";

let exec = async () => {
  let results = await MindSphereUserService.getInstance().getAllUsers("sidivp");

  console.log(results);
};

exec();
