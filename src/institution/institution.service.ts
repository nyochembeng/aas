import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Institution, InstitutionDocument } from './schema/institution.schema';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionService {
  constructor(
    @InjectModel(Institution.name)
    private institutionModel: Model<InstitutionDocument>,
  ) {}

  // Create a new institution
  async createInstitution(
    institutionDto: CreateInstitutionDto,
  ): Promise<Institution> {
    try {
      const institutionExists = await this.institutionModel
        .findOne({ name: institutionDto.name })
        .exec();
      if (institutionExists) {
        throw new ConflictException(
          'Institution with this name already exists',
        );
      }

      const createdInstitution = new this.institutionModel(institutionDto);
      return await createdInstitution.save();
    } catch (error) {
      throw new InternalServerErrorException('Error creating institution');
    }
  }

  // Get all institutions
  async getAllInstitutions(): Promise<Institution[]> {
    try {
      return await this.institutionModel
        .find()
        .populate('administrators')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching institutions');
    }
  }

  // Get institution by ID
  async getInstitutionById(id: string): Promise<Institution> {
    try {
      const institution = await this.institutionModel
        .findById(id)
        .populate('administrators')
        .exec();
      if (!institution) {
        throw new NotFoundException(`Institution with ID ${id} not found`);
      }
      return institution;
    } catch (error) {
      throw new NotFoundException(`Institution with ID ${id} not found`);
    }
  }

  // Update an institution
  async updateInstitution(
    id: string,
    updateDto: UpdateInstitutionDto,
  ): Promise<Institution> {
    try {
      const updatedInstitution = await this.institutionModel
        .findByIdAndUpdate(id, updateDto, {
          new: true,
        })
        .exec();

      if (!updatedInstitution) {
        throw new NotFoundException(`Institution with ID ${id} not found`);
      }
      return updatedInstitution;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new NotFoundException(`Institution with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Error updating institution');
    }
  }

  // Delete an institution
  async deleteInstitution(id: string): Promise<any> {
    try {
      const deletedInstitution = await this.institutionModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedInstitution) {
        throw new NotFoundException(`Institution with ID ${id} not found`);
      }
      return { message: 'Institution deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error deleting institution');
    }
  }
}
