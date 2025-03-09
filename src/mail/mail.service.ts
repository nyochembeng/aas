import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    // Create a reusable transporter object using the default SMTP transport
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: this.configService.get<boolean>('MAIL_SECURE'), // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  // Send Registration Success Email
  async sendRegistrationSuccessEmail(
    userEmail: string,
    userName: string,
  ): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('MAIL_FROM'),
      to: userEmail,
      subject: 'Registration Successful - Welcome to d-Checkin',
      text: `Hello ${userName}!\n\nCongratulations! Your registration on d-Checkin was successful.\n\nYou can now login and start using our platform. If you need any assistance, please contact our support team immediately.\n\nThank you for joining us!\n\nBest regards,\nd-Checkin Team`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Registration success email sent successfully');
    } catch (error) {
      console.error('Error sending registration success email:', error);
    }
  }

  // Send Welcome Email
  async sendWelcomeEmail(
    userEmail: string,
    userName: string,
    loginCredentials: {
      userId: string;
      email: string;
      password: string;
    },
  ): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('MAIL_FROM'),
      to: userEmail,
      subject: 'Welcome to d-Checkin',
      text: `Hello ${userName}!\n\nWelcome to d-Checkin! Your account has been created successfully.\n\nYour login credentials are:\n\n\tID: ${loginCredentials.userId}\n\n\tEmail: ${loginCredentials.email}\n\n\tPassword: ${loginCredentials.password}\n\nPlease login to your account and update your password for security reasons before getting started.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully');
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  // Send Biometric Registration Email
  async sendBiometricRegistrationEmail(
    userEmail: string,
    userName: string,
  ): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('MAIL_FROM'),
      to: userEmail,
      subject: 'Biometric Registration Successful',
      text: `Hello ${userName}!\n\nYour biometric data has been successfully registered on our platform. You can now proceed to use the biometric features.\n\nBest regards, d-Checkin`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Biometric registration email sent successfully');
    } catch (error) {
      console.error('Error sending biometric registration email:', error);
    }
  }

  // Send Password Update Email
  async sendPasswordUpdateEmail(
    userEmail: string,
    userName: string,
  ): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('MAIL_FROM'),
      to: userEmail,
      subject: 'Password Updated Successfully',
      text: `Hello ${userName}!\n\nYour password has been updated successfully. If you did not initiate this change, please contact support immediately.\n\nBest regards, d-Checkin`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Password update email sent successfully');
    } catch (error) {
      console.error('Error sending password update email:', error);
    }
  }
}
