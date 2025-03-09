import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class BulkCreateUserDto {
  @IsArray({ message: 'Users must be an array' })
  @ArrayMinSize(1, { message: 'At least one user is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto) // Ensures validation applies to each object
  users: CreateUserDto[];
}
