import { IsOptional, IsString } from 'class-validator';

export class RegisterBiometricDto {
  @IsOptional()
  @IsString({ message: 'Fingerprint data must be a valid string' })
  fingerprintData?: string;

  @IsOptional()
  @IsString({ message: 'Face ID data must be a valid string' })
  faceIdData?: string;
}
