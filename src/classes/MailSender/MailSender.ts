import Mail from "nodemailer/lib/mailer";
import nodemailer from "nodemailer";
import { config } from "node-config-ts";
import { MailOptions } from "nodemailer/lib/json-transport";

export default class MailSender {
  private static _instance: MailSender | null = null;
  private _transporter: Mail;
  private constructor(
    host: string,
    port: number,
    user: string,
    password: string
  ) {
    this._transporter = nodemailer.createTransport({
      pool: true,
      host: host,
      port: port,
      secure: true,
      auth: {
        user: user,
        pass: password,
      },
    });
  }

  public static getInstance(): MailSender {
    if (MailSender._instance == null)
      MailSender._instance = new MailSender(
        config.emailSending.host!,
        config.emailSending.port!,
        config.emailSending.user!,
        config.emailSending.pass!
      );
    return MailSender._instance;
  }

  public async sendEmail(recipient: string, subject: string, html: string) {
    let mailOptions: MailOptions = {
      from: config.emailSending.user,
      to: recipient,
      subject: subject,
      html: html,
    };

    return this._transporter.sendMail(mailOptions);
  }
}
