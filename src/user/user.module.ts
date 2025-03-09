import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schema/user.schema';
import { MailModule } from 'src/mail/mail.module';
import { HashingService } from 'src/security/hashing.service';
import { AutoGeneratePasswordService } from 'src/common/auto-generate-password';
import { EncryptionService } from 'src/security/encryption.service';

@Module({
  imports: [
    MailModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    HashingService,
    AutoGeneratePasswordService,
    EncryptionService,
  ],
  exports: [UserService], // Export UserService so other modules (like AuthModule) can use it
})
export class UserModule {}
