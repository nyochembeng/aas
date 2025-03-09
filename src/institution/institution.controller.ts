import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { Institution } from './schema/institution.schema';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/auth/rbac/roles.enum';

@Controller('institutions')
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  // Create a new institution
  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createInstitution(
    @Body() createInstitutionDto: CreateInstitutionDto,
  ): Promise<Institution> {
    return this.institutionService.createInstitution(createInstitutionDto);
  }

  // Get all institutions
  @Get()
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.STUDENT)
  @HttpCode(HttpStatus.OK)
  async getAllInstitutions(): Promise<Institution[]> {
    return this.institutionService.getAllInstitutions();
  }

  // Get institution by ID
  @Get(':id')
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.STUDENT)
  @HttpCode(HttpStatus.OK)
  async getInstitutionById(@Param('id') id: string): Promise<Institution> {
    return this.institutionService.getInstitutionById(id);
  }

  // Update an institution
  @Put(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateInstitution(
    @Param('id') id: string,
    @Body() updateInstitutionDto: UpdateInstitutionDto,
  ): Promise<Institution> {
    return this.institutionService.updateInstitution(id, updateInstitutionDto);
  }

  // Delete an institution
  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteInstitution(@Param('id') id: string): Promise<void> {
    await this.institutionService.deleteInstitution(id);
  }
}
