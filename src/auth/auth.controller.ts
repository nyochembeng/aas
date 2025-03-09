import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../user/dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { OAuthUserDto } from '../user/dto/oauth-user.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register a new user
  @Public()
  @Post('register')
  async register(@Body() registerDto: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.authService.register(registerDto);
      return res.status(HttpStatus.CREATED).json({
        message: 'User registered successfully',
        user,
      });
    } catch (error) {
      console.error('Registration Error:', error);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Registration failed',
      });
    }
  }

  // Login user
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const token = await this.authService.login(loginDto);
      return res.status(HttpStatus.OK).json({
        message: 'Login successful',
        accessToken: token.accessToken,
      });
    } catch (error) {
      console.error('Login Error:', error);
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Login failed',
      });
    }
  }

  // OAuth Authentication
  //   @Public()
  //   @Post('oauth')
  //   async oauthLogin(@Body() oauthUserDto: OAuthUserDto, @Res() res: Response) {
  //     try {
  //       const user = await this.authService.validateOAuthUser(oauthUserDto);
  //       if (!user) {
  //         throw new UnauthorizedException('OAuth authentication failed');
  //       }

  //       const token = this.authService.generateToken(user);
  //       return res.status(HttpStatus.OK).json({
  //         message: 'OAuth login successful',
  //         accessToken: token.accessToken,
  //       });
  //     } catch (error) {
  //       console.error('OAuth Login Error:', error);
  //       return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
  //         message: error.message || 'OAuth login failed',
  //       });
  //     }
  //   }

  // Protected Route Example (for testing JWT authentication)
  @UseGuards(JwtAuthGuard)
  @Post('test')
  async testAuth(@Req() req: Request, @Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      message: 'JWT authentication successful',
      user: req.user,
    });
  }
}
