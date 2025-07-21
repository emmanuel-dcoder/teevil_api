import * as fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as path from 'path';
import { config } from 'src/config/env.config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly mailTransport;

  constructor() {
    // Set up mail transport
    this.mailTransport = nodemailer.createTransport({
      host: config.mail.host,
      port: parseInt(config.mail.port, 10),
      secure: true,
      requireTLS: true,
      auth: {
        user: config.mail.user,
        pass: config.mail.password,
      },
      tls: {
        rejectUnauthorized: false, // Do not fail on invalid certs
      },
    });

    // Verify mail transport
    this.mailTransport.verify((error) => {
      if (error) {
        this.logger.error('Mail transport verification failed:', error);
      } else {
        this.logger.log('Mail transport is ready to send emails.');
      }
    });
  }

  private async getTemplate(templateName: string): Promise<string> {
    const templatePath = path.join(
      __dirname,
      `../../../templates/${templateName}.hbs`,
    );
    console.log('templatePath', templatePath);

    // Check if the template exists
    const templateExists = await fs.promises
      .access(templatePath)
      .then(() => true)
      .catch(() => false);
    if (!templateExists) {
      throw new Error(`Template ${templateName}.hbs not found`);
    }

    // Read the template file
    return await fs.promises.readFile(templatePath, 'utf8');
  }

  async sendMailNotification(
    to: string,
    subject: string,
    substitutionParams: Record<string, any>,
    templateName: string,
    options?: { from?: string; cc?: string; bcc?: string },
  ): Promise<void> {
    try {
      const { from = '"Teevil" <support@teevil.com>', cc, bcc } = options || {};
      const templateSource = await this.getTemplate(templateName);
      const compiledTemplate = handlebars.compile(templateSource);

      const mailOptions = {
        from,
        to,
        cc,
        bcc,
        subject,
        html: compiledTemplate(substitutionParams),
      };

      await this.mailTransport.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error(
        `Error sending email to ${to}:`,
        error.message,
        error.stack,
      );
    }
  }
}
