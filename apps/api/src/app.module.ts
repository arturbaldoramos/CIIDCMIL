import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    UserModule,
    AuthModule,],
  controllers: [
    AuthController, AppController],
  providers: [AppService],
})
export class AppModule { }
