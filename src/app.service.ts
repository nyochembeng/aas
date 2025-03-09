import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'AAS Service is running on port 3001! 🚀';
  }
}
