let throwOnNotificationEndpoint: string | null = null;

const __setThrowOnNotification = (notification: string | null) => {
  throwOnNotificationEndpoint = notification;
};

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

const setVapidDetails = jest.fn();
const sendNotification = jest.fn(async (notification: PushSubscription) => {
  if (notification.endpoint === throwOnNotificationEndpoint)
    throw new Error("Test send notification error");
});

export default {
  __setThrowOnNotification: __setThrowOnNotification,
  setVapidDetails: setVapidDetails,
  sendNotification: sendNotification,
};
