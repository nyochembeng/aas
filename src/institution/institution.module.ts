import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstitutionService } from './institution.service';
import { InstitutionController } from './institution.controller';
import { Institution, InstitutionSchema } from './schema/institution.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Institution.name, schema: InstitutionSchema },
    ]),
  ],
  providers: [InstitutionService],
  controllers: [InstitutionController],
  exports: [InstitutionService], // Export the service so it can be used in other modules
})
export class InstitutionModule {}
