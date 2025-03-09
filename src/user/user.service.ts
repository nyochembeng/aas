import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailService } from '../mail/mail.service';
import { EncryptionService } from '../security/encryption.service';
import { HashingService } from '../security/hashing.service';
import { AutoGeneratePasswordService } from '../common/auto-generate-password';
import { Role } from 'src/auth/rbac/roles.enum';
import { RegisterBiometricDto } from './dto/register-biometric.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { BulkCreateUserDto } from './dto/bulk-create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailService: MailService,
    private readonly hashingService: HashingService,
    private readonly autoGeneratePasswordService: AutoGeneratePasswordService,
    private readonly encryptionService: EncryptionService,
  ) {}

  // Create user (Admin creates an employee/student account)
  async createUser(
    createUserDto: CreateUserDto,
    isAdmin: boolean,
  ): Promise<User> {
    try {
      const { email, studentId, employeeId, adminId, firstName, role } =
        createUserDto;

      const existingUser = await this.userModel.findOne({
        $or: [{ email }, { studentId }, { employeeId }, { adminId }],
      });
      // Toggle between adminId, studentId and EmployeeId
      const ID = !studentId ? (!employeeId ? adminId : employeeId) : studentId;
      if (existingUser) {
        throw new BadRequestException(
          'User with this email or ID already exists.',
        );
      }

      const password = this.autoGeneratePasswordService.generatePlainPassword();
      const hashedPassword = await this.hashingService.hashPassword(password);

      const userIdField =
        role === Role.STUDENT
          ? 'studentId'
          : role === Role.EMPLOYEE
            ? 'employeeId'
            : 'adminId';

      const newUser = new this.userModel({
        ...createUserDto,
        [userIdField]: ID as string,
        password: hashedPassword,
      });

      await newUser.save();
      if (isAdmin) {
        await this.mailService.sendRegistrationSuccessEmail(
          newUser.email,
          firstName,
        );
      } else {
        await this.mailService.sendWelcomeEmail(newUser.email, firstName, {
          userId: ID as string,
          email,
          password,
        });
      }
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user.');
    }
  }

  // Create Student/Employee in bulk
  async bulkCreateUsers(bulkCreateUserDto: BulkCreateUserDto): Promise<User[]> {
    try {
      const usersToCreate = bulkCreateUserDto.users;
      const createdUsers: User[] = [];

      for (const userDto of usersToCreate) {
        const {
          email,
          studentId,
          employeeId,
          adminId,
          firstName,
          lastName,
          role,
        } = userDto;

        // Check if the user already exists
        const existingUser = await this.userModel.findOne({
          $or: [{ email }, { studentId }, { employeeId }, { adminId }],
        });
        // Toggle between adminId, studentId and EmployeeId
        const ID = !studentId
          ? !employeeId
            ? adminId
            : employeeId
          : studentId;
        if (existingUser) {
          throw new BadRequestException(
            `User with email ${email} or ID ${ID} already exists.`,
          );
        }

        // Auto-generate password
        const password =
          this.autoGeneratePasswordService.generatePlainPassword();
        const hashedPassword = await this.hashingService.hashPassword(password);

        // Assign user ID based on role
        const userIdField =
          role === Role.STUDENT
            ? 'studentId'
            : role === Role.EMPLOYEE
              ? 'employeeId'
              : 'adminId';

        // Create new user object
        const newUser = new this.userModel({
          ...userDto,
          [userIdField]: ID as string,
          password: hashedPassword,
        });

        await newUser.save();
        createdUsers.push(newUser);

        // Send welcome email
        await this.mailService.sendWelcomeEmail(newUser.email, firstName, {
          userId: ID as string,
          email,
          password,
        });
      }

      return createdUsers;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create users in bulk.');
    }
  }

  // Update user details
  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new NotFoundException('User not found');

      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        updateUserDto,
        { new: true, runValidators: true }, // Ensure new data is validated
      );

      if (!updatedUser)
        throw new NotFoundException('Failed to update user. User not found.');

      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user.');
    }
  }

  // Register biometric data
  async registerBiometric(
    userId: string,
    biometricDto: RegisterBiometricDto,
  ): Promise<User> {
    try {
      const { fingerprintData, faceIdData } = biometricDto;

      const user = await this.userModel.findById(userId);
      if (!user) throw new NotFoundException('User not found');

      if (fingerprintData)
        user.fingerprintData = this.encryptionService.encrypt(fingerprintData);
      if (faceIdData)
        user.faceIdData = this.encryptionService.encrypt(faceIdData);

      user.isBiometricRegistered = true;
      await user.save();

      await this.mailService.sendBiometricRegistrationEmail(
        user.email,
        user.firstName,
      );

      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to register biometric data.',
      );
    }
  }

  // Update password
  async updatePassword(
    userId: string,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    try {
      const { newPassword } = resetPasswordDto;

      const user = await this.userModel.findById(userId);
      if (!user) throw new NotFoundException('User not found');

      user.password = await this.hashingService.hashPassword(newPassword);
      user.isPasswordChanged = true;
      await user.save();

      await this.mailService.sendPasswordUpdateEmail(
        user.email,
        user.firstName,
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to update password.');
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch user.');
    }
  }

  // Get all users
  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users.');
    }
  }

  // Delete user
  async deleteUser(userId: string): Promise<void> {
    try {
      const user = await this.userModel.findByIdAndDelete(userId);
      if (!user) throw new NotFoundException('User not found');
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete user.');
    }
  }
}
