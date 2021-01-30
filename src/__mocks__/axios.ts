import { snooze } from "../utilities/utilities";

let mockDelay: any;
let mockError: any;
let mockResponseData: any = {};
let mockResponseStatus: number = 200;

export default {
  __setMockDelay: function(value: number) {
    mockDelay = value;
  },

  __setMockError: function(error: any) {
    mockError = error;
  },

  __setMockResponseData: function(responseData: any) {
    mockResponseData = responseData;
  },

  __setMockResponseStatus: function(responseStatus: number) {
    mockResponseStatus = responseStatus;
  },

  post: jest.fn(function(url: string, data: any, config: any) {
    return new Promise(async (resolve, reject) => {
      if (mockDelay) await snooze(mockDelay);
      if (mockResponseStatus < 200 || mockResponseStatus >= 300)
        return reject(
          new Error(`Server responded with status code: ${mockResponseStatus}`)
        );
      if (mockError) return reject(mockError);

      return resolve({
        status: mockResponseStatus,
        data: mockResponseData,
      });
    });
  }),
};
