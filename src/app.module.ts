import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/adapter/in/authController';
import { AuthService } from './auth/application/service/authService';
import { UserData } from './user/application/service/userData';
import { JwtService } from '@nestjs/jwt';
import { UserController } from './user/adapter/in/userController';
import { UserService } from './user/application/service/userService';
@Module({
  imports: [],
  controllers: [AppController, AuthController, UserController],
  providers: [AppService, AuthService, UserService, UserData, JwtService],
})
export class AppModule {}
