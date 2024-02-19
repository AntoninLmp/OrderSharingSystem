import { Module } from "@nestjs/common";
import { UserManagementService } from "./application/userManagement.service";
import { UserManagementRepository } from "./persistence/userManagement.repository";
import { UserManagementController } from "./presentation/userManagement.controller";

@Module({
  controllers: [UserManagementController],
  providers: [
    {
      provide: "IUserManagementRepository",
      useClass: UserManagementRepository,
    },
    {
      provide: "IUserManagementService",
      useClass: UserManagementService,
    },
  ],
})
export class UserModule {}
