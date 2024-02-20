import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserManagementService } from "./application/userManagement.service";
import { User } from "./domain/user.entity";
import { UsersController } from "./presentation/users.controller";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    {
      provide: "IUsersService",
      useClass: UserManagementService,
    },
  ],
})
export class UsersModule {}
