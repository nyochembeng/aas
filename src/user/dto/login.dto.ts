import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class LoginDto {
  @ValidateIf((o) => !o.email) // Required if email is not provided
  @IsOptional()
  @IsString({ message: 'Admin ID must be a string' })
  adminId?: string;

  @ValidateIf((o) => !o.email) // Required if email is not provided
  @IsOptional()
  @IsString({ message: 'Student ID must be a string' })
  studentId?: string;

  @ValidateIf((o) => !o.email) // Required if email is not provided
  @IsOptional()
  @IsString({ message: 'Employee ID must be a string' })
  employeeId?: string;

  @ValidateIf((o) => !o.adminId && !o.studentId && !o.employeeId) // Required if no ID is provided
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required if no ID is provided' })
  email?: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
