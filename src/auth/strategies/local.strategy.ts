import { Injectable, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserDocument } from 'src/user/schema/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'identifier' }); // Accepts email or ID
  }

  async validate(identifier: string, password: string): Promise<UserDocument> {
    let user: UserDocument | null;

    if (this.isEmail(identifier)) {
      user = await this.authService.validateUserByEmail(identifier, password);
    } else {
      user = await this.authService.validateUserById(identifier, password);
    }

    if (!user) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid email/ID or password',
      });
    }

    return user;
  }

  private isEmail(identifier: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier); // Simple email regex check
  }
}
