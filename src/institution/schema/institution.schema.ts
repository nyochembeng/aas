import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type InstitutionDocument = Institution & Document;

@Schema({ timestamps: true })
export class Institution {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, enum: ['school', 'company'] })
  type: 'school' | 'company';

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  administrators: mongoose.Types.Array<mongoose.Schema.Types.ObjectId>; // Reference to the admin user(s)
}

export const InstitutionSchema = SchemaFactory.createForClass(Institution);
