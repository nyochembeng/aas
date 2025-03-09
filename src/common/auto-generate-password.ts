import { Injectable } from '@nestjs/common';
import { HashingService } from '../security/hashing.service';
import * as crypto from 'crypto';

@Injectable()
export class AutoGeneratePasswordService {
  constructor(private readonly hashingService: HashingService) {}

  // Generate a secure random password
  private generateRandomPassword(length: number): string {
    return crypto.randomBytes(length).toString('hex'); // Generate a secure password as a hex string
  }

  // Generate password and hash it
  async generateHashedPassword(length: number = 12): Promise<string> {
    const password = this.generateRandomPassword(length); // Generate password
    return await this.hashingService.hashPassword(password); // Hash the generated password
  }

  // Optionally, you can return the plain password if needed for any reason
  generatePlainPassword(length: number = 12): string {
    return this.generateRandomPassword(length); // Return plain password
  }
}
