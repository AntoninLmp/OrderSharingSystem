import * as process from "process";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module";
import { AuthService } from "./application/auth.service";
import { AuthController } from "./presentation/auth.controller";

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: "IAuthService",
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
