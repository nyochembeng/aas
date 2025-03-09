import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  lastName?: string;

  @IsOptional()
  @IsPhoneNumber('CM', { message: 'Invalid phone number format' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Profile photo URL must be a string' })
  profilePhoto?: string;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @IsOptional()
  @IsBoolean({ message: 'isSuperAdmin must be a boolean' })
  isSuperAdmin?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'isPasswordChanged must be a boolean' })
  isPasswordChanged?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'isBiometricRegistered must be a boolean' })
  isBiometricRegistered?: boolean;

  @IsOptional()
  @IsString({ message: 'Fingerprint data must be a string' })
  fingerprintData?: string;

  @IsOptional()
  @IsString({ message: 'Face ID data must be a string' })
  faceIdData?: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;

  @IsOptional()
  @IsString({ message: 'Last login date must be a valid date string' })
  lastLogin?: string;
}
