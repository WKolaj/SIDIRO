let throwOnEmail: string | null = null;

const __setThrowOnEmail = (email: string | null) => {
  throwOnEmail = email;
};

const __sendMailTransportFunc = jest.fn(async (options: { to: string }) => {
  if (throwOnEmail === options.to)
    throw new Error("TestSendMailTransportError");
});

const createTransport = jest.fn((mailOptions: any) => {
  return {
    sendMail: __sendMailTransportFunc,
  };
});

export default {
  __setThrowOnEmail: __setThrowOnEmail,
  __sendMailTransportFunc: __sendMailTransportFunc,
  createTransport: createTransport,
};
