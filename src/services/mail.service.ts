import emailjs, { EmailJSResponseStatus } from '@emailjs/nodejs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private configService: ConfigService) {
    emailjs.init({
      publicKey: this.configService.get<string>('EMAIL_JS_PUBLIC_KEY'),
      privateKey: this.configService.get<string>('EMAIL_JS_PRIVATE_KEY'),
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `${this.configService.get<string>('FRONTEND_URL')}/auth/reset-password?token=${token}`;
    const params = {
      to_name: to,
      to_email: to,
      link: resetLink,
    };

    try {
      const response = await emailjs.send(
        this.configService.get<string>('EMAIL_JS_SERVICE_KEY'),
        this.configService.get<string>('EMAIL_JS_PASSWORD_RESET_TEMPLATE_ID'),
        params,
      );
      console.log('Email sent successfully:', response);
      return true;
    } catch (err) {
      if (err instanceof EmailJSResponseStatus) {
        console.log('EMAILJS FAILED...', err);
        return false;
      }
      console.log('ERROR', err);
      return false;
    }
  }
}
