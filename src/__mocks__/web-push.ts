export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

const setVapidDetails = jest.fn();
const sendNotification = jest.fn();

export default {
  setVapidDetails: setVapidDetails,
  sendNotification: sendNotification,
};
