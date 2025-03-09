import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from '../user/dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User, UserDocument } from '../user/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashingService } from 'src/security/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) {}

  // Register
  async register(registerDto: CreateUserDto): Promise<User> {
    const { email, password } = registerDto;

    // Check if email already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    try {
      const hashedPassword = await this.hashingService.hashPassword(password);
      return await this.userService.createUser(
        { ...registerDto, password: hashedPassword },
        true, // isAdmin flag
      );
    } catch (error) {
      console.error('Error during registration:', error);
      throw new InternalServerErrorException('Error creating user');
    }
  }

  // Login
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    try {
      const { email, studentId, employeeId, adminId, password } = loginDto;
      const ID = studentId || employeeId || adminId;
      let user: User | null = null;

      if (email) {
        user = await this.validateUserByEmail(email, password);
      } else if (ID) {
        user = await this.validateUserById(ID, password);
      }

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const Bearer = this.generateToken(user);
      console.log(`Authorization: Bearer ${Bearer as any}
        `);
      return Bearer;
    } catch (error) {
      console.error('Login Error:', error);
      throw new InternalServerErrorException('Login failed');
    }
  }

  // Validate user by email
  async validateUserByEmail(
    email: string,
    password: string,
  ): Promise<UserDocument> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('Wrong email');
      }

      const isPasswordValid = await this.hashingService.comparePassword(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Wrong password');
      }

      return user;
    } catch (error) {
      console.error('User validation failed:', error);
      throw new InternalServerErrorException('User validation failed');
    }
  }

  // Validate user by ID
  async validateUserById(id: string, password: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException('Wrong user ID');
      }

      const isPasswordValid = await this.hashingService.comparePassword(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Wrong password');
      }

      return user;
    } catch (error) {
      console.error('User validation failed:', error);
      throw new InternalServerErrorException('User validation failed');
    }
  }

  // // OAuth User Validation
  // async validateOAuthUser(profile: {
  //   provider: string;
  //   id: string;
  //   email?: string;
  //   firstName?: string;
  //   lastName?: string;
  // }): Promise<User | null> {
  //   try {
  //     let user = await this.userService.findByOAuthId(
  //       profile.provider,
  //       profile.id,
  //     );

  //     if (!user && profile.email) {
  //       // Check if email is already linked to another account
  //       const existingUser = await this.userModel.findOne({
  //         email: profile.email,
  //       });
  //       if (existingUser) {
  //         throw new BadRequestException(
  //           'Email is already linked to another account',
  //         );
  //       }

  //       // Create new user if email is not already linked
  //       user = await this.userService.createUser(
  //         {
  //           email: profile.email,
  //           firstName: profile.firstName || 'Unknown User',
  //           lastName: profile.lastName || '',
  //           oauthProvider: profile.provider,
  //           oauthId: profile.id,
  //         },
  //         false, // Not an admin
  //       );
  //     }

  //     return user;
  //   } catch (error) {
  //     console.error('OAuth Authentication Error:', error);
  //     throw new InternalServerErrorException('OAuth authentication failed');
  //   }
  // }

  // Generate JWT Token
  private generateToken(user: User): { accessToken: string } {
    try {
      const ID = user.studentId || user.employeeId || user.adminId;
      const payload = { sub: ID, email: user.email, role: user.role };
      return { accessToken: this.jwtService.sign(payload) };
    } catch (error) {
      console.error('Token generation failed:', error);
      throw new InternalServerErrorException('Token generation failed');
    }
  }
}
