import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterBiometricDto } from './dto/register-biometric.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { BulkCreateUserDto } from './dto/bulk-create-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/auth/rbac/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto, false);
  }

  @Post('bulk-create')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async bulkCreate(@Body() bulkCreateUserDto: BulkCreateUserDto) {
    return this.userService.bulkCreateUsers(bulkCreateUserDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.STUDENT)
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Put('biometric/:id')
  @Roles(Role.EMPLOYEE, Role.STUDENT)
  @HttpCode(HttpStatus.OK)
  async registerBiometric(
    @Param('id') id: string,
    @Body() biometricDto: RegisterBiometricDto,
  ) {
    return this.userService.registerBiometric(id, biometricDto);
  }

  @Put('password/:id')
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.STUDENT)
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Param('id') id: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.userService.updatePassword(id, resetPasswordDto);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.STUDENT)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Get()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.userService.getAllUsers();
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
