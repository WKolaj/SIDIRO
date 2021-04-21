import MailSender from "../../../../classes/MailSender/MailSender";
import nodemailer from "nodemailer";
import { getPrivateProperty } from "../../../utilities/utilities";

describe("MailSender", () => {
  beforeEach(async () => {
    //Clearing sending mails
    (MailSender as any)._instance = null;

    jest.clearAllMocks();
  });

  afterEach(async () => {
    //Clearing sending mails
    (MailSender as any)._instance = null;

    jest.clearAllMocks();
  });

  describe("getInstance", () => {
    let exec = () => {
      return MailSender.getInstance();
    };

    it("should return valid instance of MailSender", () => {
      let result = exec();

      expect(result).not.toEqual(null);
      expect(result instanceof MailSender).toEqual(true);
    });

    it("should return the same instance of MailSender if called several times", () => {
      let result1 = exec();
      let result2 = exec();
      let result3 = exec();

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
      expect(result3).toEqual(result1);
    });

    it("should create valid mail transporter", () => {
      let result = exec();

      let createTransporterMockFunc = nodemailer.createTransport as jest.Mock;
      expect(createTransporterMockFunc).toHaveBeenCalledTimes(1);
      expect(createTransporterMockFunc.mock.calls[0]).toEqual([
        {
          pool: true,
          host: "testEmail@test.email.com",
          port: 1234,
          secure: true,
          auth: {
            user: "testUserName",
            pass: "testUserPassword",
          },
        },
      ]);

      expect((result as any)._transporter).toBeDefined();
    });
  });

  describe("sendEmail", () => {
    let mailSender: MailSender;
    let recipient: string;
    let subject: string;
    let html: string;

    beforeEach(() => {
      recipient = "testRecipient1@test.mail.com";
      subject = "testSubject1";
      html = "testHTML1";
    });

    let exec = async () => {
      mailSender = MailSender.getInstance();

      return mailSender.sendEmail(recipient, subject, html);
    };

    it("should send email via nodemailer", async () => {
      await exec();

      let transporter = getPrivateProperty(mailSender, "_transporter");

      let expectedMailOptions = {
        from: "testUserName",
        to: recipient,
        subject: subject,
        html: html,
      };

      expect(transporter.sendMail).toHaveBeenCalledTimes(1);
      expect(transporter.sendMail.mock.calls[0]).toEqual([expectedMailOptions]);
    });
  });
});
