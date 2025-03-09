import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Role } from '../../auth/rbac/roles.enum';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsEnum(Role, {
    message: 'Invalid role. Must be ADMIN, STUDENT, or EMPLOYEE',
  })
  @IsNotEmpty({ message: 'Role is required' })
  role: Role;

  @IsPhoneNumber('CM', { message: 'Invalid phone number format' })
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @IsOptional()
  @IsString({ message: 'Profile photo must be a valid string URL' })
  profilePhoto?: string;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @IsNotEmpty({ message: 'Institution ID is required' })
  @IsString({ message: 'Institution ID must be a valid string' })
  institutionId: string;

  // Mutually exclusive IDs: Only one should be provided
  @ValidateIf((o) => !o.studentId && !o.employeeId)
  @IsOptional()
  @IsString({ message: 'Admin ID must be a string' })
  adminId?: string;

  @ValidateIf((o) => !o.adminId && !o.employeeId)
  @IsOptional()
  @IsString({ message: 'Student ID must be a string' })
  studentId?: string;

  @ValidateIf((o) => !o.adminId && !o.studentId)
  @IsOptional()
  @IsString({ message: 'Employee ID must be a string' })
  employeeId?: string;

  @IsBoolean({ message: 'isSuperAdmin must be a boolean value' })
  @IsOptional()
  isSuperAdmin?: boolean;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
