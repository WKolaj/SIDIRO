export const __sendMailTransportFunc = jest.fn();

export const createTransport = jest.fn((mailOptions: any) => {
  sendMail: __sendMailTransportFunc;
});
