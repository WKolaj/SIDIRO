// import appStart from "./startup/app";

// export default appStart(__dirname);

import { MindSphereUserService } from "./classes/MindSphereService/MindSphereUserService";

let userService = MindSphereUserService.getInstance();

let exec = async () => {
  let allUsers = await userService.getAllUsers(
    "sidivp",
    "0e41a8824769852816cce43df2833741",
    null,
    "ilndemon@wp.pl"
  );

  console.log(
    allUsers.map((user) => {
      return { name: user.name, email: user.userName };
    })
  );
};

exec();
