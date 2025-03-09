import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Role } from '../../auth/rbac/roles.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, enum: Role, index: true }) // Index for faster queries
  role: Role;

  @Prop({ type: String, unique: true, sparse: true }) // Unique for admins
  adminId?: string;

  @Prop({ type: String, unique: true, sparse: true }) // Unique for students
  studentId?: string;

  @Prop({ type: String, unique: true, sparse: true }) // Unique for employees
  employeeId?: string;

  @Prop({ required: true, unique: true }) // Ensure phone number uniqueness
  phone: string;

  @Prop({ type: String })
  profilePhoto?: string;

  @Prop({ type: String })
  address?: string;

  @Prop({ type: Boolean, default: false }) // Determines if the admin is a super admin
  isSuperAdmin?: boolean;

  @Prop({ required: true, select: false }) // Ensure password is not exposed in queries
  password: string;

  @Prop({ default: false }) // True after first login when user changes password
  isPasswordChanged: boolean;

  @Prop({ default: false }) // True if biometric data has been registered
  isBiometricRegistered: boolean;

  @Prop({ type: String, default: null }) // Store fingerprint template if applicable
  fingerprintData?: string;

  @Prop({ type: String, default: null }) // Store Face ID data if applicable
  faceIdData?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date, default: null })
  lastLogin?: Date;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
  }) // A user belongs to one institution
  institutionId: mongoose.Schema.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
