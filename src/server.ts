import MindSphereTokenManager from "./classes/MindSphereService/MindSphereToken/MindSphereTokenManager";

let exec = async () => {
  let tokenManager = MindSphereTokenManager.getInstance();

  let token = await tokenManager.getToken();

  console.log(token);

  let tokenManager2 = MindSphereTokenManager.getInstance();

  let token2 = await tokenManager2.getToken();

  console.log(token2);
};

exec();
