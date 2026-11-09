import { Injectable } from '@nestjs/common';
import { createTransport, Transporter, SendMailOptions } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {

  transporter: Transporter

  constructor(
    private configService: ConfigService
  ) {
    this.transporter = createTransport({
      host: this.configService.get('nodemailer_host'),
      port: this.configService.get('nodemailer_port'),
      secure: true,
      auth: {
        user: this.configService.get('nodemailer_auth_user'),
        pass: this.configService.get('nodemailer_auth_pass')
      },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
    });
  }

  async sendMail({ to, subject, html }: Pick<SendMailOptions, 'to' | 'subject' | 'html'>) {
    await this.transporter.sendMail({
      from: {
        name: '会议室预定系统',
        address: this.configService.get('nodemailer_auth_user')
      },
      to,
      subject,
      html
    });
  }
}
