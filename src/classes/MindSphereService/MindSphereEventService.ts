import {
  MindSphereService,
  MindSpherePaginatedResponse,
} from "./MindSphereService";

const mindSphereFileSeriesApiUrl = `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`;

export type MindSphereStandardEvent = {
  id?: string;
  etag?: number;
  typeId?: string;
  timestamp: string;
  entityId: string;
  severity: number;
  description: string;
  code: string;
  source: string;
  acknowledged?: boolean;
  correlationId?: string;
};

/**
 * @description Class representing event service of MindSphere
 */
export class MindSphereEventService extends MindSphereService {
  /**
   * @description Main instance of Singleton
   */
  private static _instance: MindSphereEventService | null = null;

  /**
   * @description Method for getting (or creating if not exists) main instance of Singleton
   */
  public static getInstance(): MindSphereEventService {
    if (MindSphereEventService._instance == null) {
      MindSphereEventService._instance = new MindSphereEventService(
        mindSphereFileSeriesApiUrl
      );
    }

    return MindSphereEventService._instance;
  }

  /**
   * @description Class representing event service of MindSphere
   * @param url url of event service
   */
  private constructor(url: string) {
    super(url);
  }

  /**
   * @description Methof for getting URL of event (to get single event details)
   * @param eventId id of the event
   */
  private _getEventUrl(eventId: string) {
    return encodeURI(`${this._url}/${eventId}`);
  }

  /**
   * @description Method for getting filter to retrieve events
   * @param assetId ID of asset that stores the event
   * @param from Unix Date of the begin of search interval
   * @param to  Unix Date of the end of search interval
   * @param source ID of asset associated with event. OPTIONAL - null if events should not be filtered by this field
   */
  private _getEventFilter(
    assetId: string,
    from: number,
    to: number,
    source: string | null = null
  ) {
    let filter: {
      entityId: string;
      source?: string;
      timestamp: {
        after: string;
        before: string;
      };
    } = {
      entityId: assetId,
      timestamp: {
        after: MindSphereService.convertUnixToMindSphereDate(from),
        before: MindSphereService.convertUnixToMindSphereDate(to),
      },
    };

    if (source != null) filter.source = source;

    return {
      size: 100,
      filter: filter,
    };
  }

  /**
   * @description Method for getting event (its details) based on id
   * @param tenant tenant to call API
   * @param eventId id of the event to get
   */
  public async getEvent(
    tenant: string,
    eventId: string
  ): Promise<MindSphereStandardEvent> {
    //MindSphere Event API cannot accept Application/JSON, plain text or */*
    let result = await this._callAPI(
      tenant,
      "GET",
      this._getEventUrl(eventId),
      null,
      null,
      {
        Accept: "application/json, text/plain, */*",
      }
    );

    return result.data;
  }

  /**
   * @description Method for getting all events that suits filter criteria - method automatically gets total number of events even if there is paggination in MindSphere
   * @param tenant tenant to call API
   * @param assetId Id of asset that stores the event
   * @param from Unix Date of the begin of search interval
   * @param to Unix Date of the end of search interval
   * @param source ID of asset associated with event. OPTIONAL - null if events should not be filtered by this field
   */
  public async getEvents(
    tenant: string,
    assetId: string,
    from: number,
    to: number,
    source: string | null = null
  ): Promise<MindSphereStandardEvent[]> {
    let results = await this._callPaginatedAPI(
      tenant,
      "GET",
      this._url,
      this._getEventFilter(assetId, from, to, source),
      null,
      {
        Accept: "application/json, text/plain, */*",
      }
    );

    let eventsToReturn: MindSphereStandardEvent[] = [];

    for (let result of results) {
      if (
        result != null &&
        result._embedded != null &&
        result._embedded.events != null
      ) {
        eventsToReturn.push(...result._embedded.events);
      }
    }

    return eventsToReturn;
  }

  /**
   * @description Method for posting event to MindSphere
   * @param tenant tenant to call API
   * @param event Payload of event to send
   */
  public async postEvent(tenant: string, event: MindSphereStandardEvent) {
    if (event.typeId == null)
      event = {
        ...event,
        typeId:
          "com.siemens.mindsphere.eventmgmt.event.type.MindSphereStandardEvent",
      };

    await this._callAPI(
      tenant,
      "POST",
      this._url,
      null,
      { ...event },
      {
        Accept: "application/json, text/plain, */*",
      }
    );
  }
}
