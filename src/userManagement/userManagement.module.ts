import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserManagementService } from "./application/userManagement.service";
import { User } from "./domain/user.entity";
import { UserManagementController } from "./presentation/userManagement.controller";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserManagementController],
  providers: [
    {
      provide: "IUserManagementService",
      useClass: UserManagementService,
    },
  ],
})
export class UserModule {}
