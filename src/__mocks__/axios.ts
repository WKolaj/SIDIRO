import { snooze } from "../utilities/utilities";

let mockDelay: any;
let mockError: any | null = null;
let mockResponseData: any = {};
let mockResponseStatus: number = 200;
let mockResponseCollection: any[] = [];
let mockResponseCollectionIndex: number = 0;
let mockResponseCollectionStatus: number[] = [];
let mockResponseCollectionHeaders: any[] = [];
let throwErrorIndex: number = -1;

export default {
  __setMockDelay: function(value: number) {
    mockDelay = value;
  },

  __setMockError: function(error: any, throwIndex: number = -1) {
    mockError = error;
    throwErrorIndex = throwIndex;
  },

  __setMockResponseData: function(responseData: any) {
    mockResponseData = responseData;
  },

  __setMockResponseDataCollection: function(
    responseCollection: any[],
    responseCollectionStatus: number[],
    responseCollectionHeaders: any[]
  ) {
    mockResponseCollection = responseCollection;
    mockResponseCollectionStatus = responseCollectionStatus;
    mockResponseCollectionHeaders = responseCollectionHeaders;
    mockResponseCollectionIndex = 0;
  },

  __reset: function() {
    mockResponseData = {};
    mockResponseStatus = 200;
    mockResponseCollection = [];
    mockResponseCollectionIndex = 0;
    mockResponseCollectionStatus = [];
    mockResponseCollectionHeaders = [];
    mockError = null;
  },

  __setMockResponseStatus: function(responseStatus: number) {
    mockResponseStatus = responseStatus;
  },

  request: jest.fn(function(config: any) {
    return new Promise(async (resolve, reject) => {
      if (mockDelay) await snooze(mockDelay);

      if (mockError && throwErrorIndex < 0) return reject(mockError);

      if (
        mockError &&
        throwErrorIndex >= 0 &&
        mockResponseCollectionIndex >= throwErrorIndex
      ) {
        return reject(mockError);
      }

      if (mockResponseCollection.length > 0) {
        let data = mockResponseCollection[mockResponseCollectionIndex];
        let status = mockResponseCollectionStatus[mockResponseCollectionIndex];
        let headers =
          mockResponseCollectionHeaders[mockResponseCollectionIndex];
        mockResponseCollectionIndex++;

        if (status < 200 || status >= 300)
          return reject(
            new Error(`Server responded with status code: ${status}`)
          );

        return resolve({
          status: status,
          data: data,
          headers: headers,
        });
      }

      if (mockResponseStatus < 200 || mockResponseStatus >= 300)
        return reject(
          new Error(`Server responded with status code: ${mockResponseStatus}`)
        );
      return resolve({
        status: mockResponseStatus,
        data: mockResponseData,
      });
    });
  }),
};
