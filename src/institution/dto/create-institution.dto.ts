import {
  IsString,
  IsEnum,
  IsEmail,
  IsArray,
  IsOptional,
  IsPhoneNumber,
  Length,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInstitutionDto {
  @IsEnum(['school', 'company'], {
    message: 'Type must be either school or company',
  })
  type: 'school' | 'company';

  @IsString()
  @Length(3, 100, { message: 'Name must be between 3 and 100 characters' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsPhoneNumber()
  @Length(6, 20, {
    message: 'Phone number must be between 6 and 20 characters',
  })
  phoneNumber: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsArray()
  @IsOptional()
  @Type(() => String)
  @IsMongoId({ each: true })
  administrators?: string[];
}
