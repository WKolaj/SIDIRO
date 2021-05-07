import webpush from "web-push";
import { config } from "node-config-ts";
import CustomService from "../CustomService/CustomService";
import { MindSphereDataStorage } from "../DataStorage/MindSphereDataStorage";
import { compareObjectsByValue } from "../../utilities/utilities";

export interface SubscriberPayload {
  subscriptionData: webpush.PushSubscription;
  language: "pl" | "en";
  userId: string;
}

//TODO - test this class again with userId in subscricption payload
export default class NotificationManager {
  private _subscribersStorage: MindSphereDataStorage<SubscriberPayload[]>;
  private _initialized: boolean = false;
  private static _instance: NotificationManager | null = null;

  get Initialized() {
    return this._initialized;
  }

  private constructor(tenantName: string, storageAssetId: string) {
    this._subscribersStorage = new MindSphereDataStorage(
      tenantName,
      storageAssetId,
      "sub.json"
    );
  }

  public static getInstance(): NotificationManager {
    if (NotificationManager._instance == null)
      NotificationManager._instance = new NotificationManager(
        config.notificationSending.tenant!,
        config.notificationSending.assetId!
      );
    return NotificationManager._instance;
  }

  public async init() {
    await this._subscribersStorage.init();
    webpush.setVapidDetails(
      `mailto:<${config.notificationSending.email!}>`,
      config.notificationSending.publicKey!,
      config.notificationSending.privateKey!
    );
    this._initialized = true;
  }

  public async sendNotification(
    subscription: webpush.PushSubscription,
    payload: string
  ) {
    if (!this.Initialized)
      throw new Error("NotificationManager not initialized!");
    return webpush.sendNotification(subscription, payload);
  }

  public async getSubscribers(
    serviceId: string
  ): Promise<SubscriberPayload[] | null> {
    if (!this.Initialized)
      throw new Error("NotificationManager not initialized!");
    return this._subscribersStorage.getData(serviceId);
  }

  public async checkIfSubscriberExists(
    serviceId: string,
    subscriptionData: webpush.PushSubscription,
    userId: string
  ): Promise<boolean> {
    if (!this.Initialized)
      throw new Error("NotificationManager not initialized!");

    let data = await this._subscribersStorage.getData(serviceId);
    if (data == null) return false;

    //checking subscription data by value by stringifying
    let subscriber = data.find(
      (subscriber) =>
        compareObjectsByValue(subscriber.subscriptionData, subscriptionData) &&
        subscriber.userId === userId
    );
    return subscriber != null;
  }

  public async addSubscriber(serviceId: string, subscriber: SubscriberPayload) {
    if (!this.Initialized)
      throw new Error("NotificationManager not initialized!");
    let serviceData = await this._subscribersStorage.getData(serviceId);
    if (serviceData == null) serviceData = [];
    let newServiceData = [...serviceData, subscriber];

    return this._subscribersStorage.setData(serviceId, newServiceData);
  }

  public async removeSubscriber(
    serviceId: string,
    subscriptionData: webpush.PushSubscription,
    userId: string
  ) {
    if (!this.Initialized)
      throw new Error("NotificationManager not initialized!");

    //Checking if service exists in notification
    let data = await this._subscribersStorage.getData(serviceId);
    if (data == null) return;

    //Checking if subscriber exists
    let subscriberToDelete = data.find(
      (subscriber) =>
        compareObjectsByValue(subscriber.subscriptionData, subscriptionData) &&
        subscriber.userId === userId
    );
    if (subscriberToDelete == null) return;

    let newData = data.filter(
      (subscriber) => subscriber !== subscriberToDelete
    );

    return this._subscribersStorage.setData(serviceId, newData);
  }
}
