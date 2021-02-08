import { MindSphereService } from "./MindSphereService";

const mindSphereFileSeriesApiUrl = `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`;

export type MindSphereStandardEvent = {
  id?: string;
  etag?: 0;
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

export class MindSphereEventService extends MindSphereService {
  private static _instance: MindSphereEventService | null = null;

  public static getInstance(): MindSphereEventService {
    if (MindSphereEventService._instance == null) {
      MindSphereEventService._instance = new MindSphereEventService(
        mindSphereFileSeriesApiUrl
      );
    }

    return MindSphereEventService._instance;
  }

  private constructor(url: string) {
    super(url);
  }

  private _getEventUrl(eventId: string) {
    return encodeURI(`${this._url}/${eventId}`);
  }

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

  public async getEvent(eventId: string): Promise<MindSphereStandardEvent> {
    //MindSphere Event API cannot accept Application/JSON, plain text or */*
    let result = await this._callAPI(
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

  public async getEvents(
    assetId: string,
    from: number,
    to: number,
    source: string | null = null
  ): Promise<MindSphereStandardEvent[]> {
    //MindSphere Event API cannot accept Application/JSON, plain text or */*
    let result = await this._callAPI(
      "GET",
      this._url,
      this._getEventFilter(assetId, from, to, source),
      null,
      {
        Accept: "application/json, text/plain, */*",
      }
    );

    if (result?.data?._embedded?.events) {
      return result?.data?._embedded?.events;
    } else {
      return [];
    }
  }

  public async postEvent(event: MindSphereStandardEvent) {
    if (event.typeId == null)
      event = {
        ...event,
        typeId:
          "com.siemens.mindsphere.eventmgmt.event.type.MindSphereStandardEvent",
      };

    await this._callAPI(
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

//TODO - add comments to this class
//TODO - add tests for this class
