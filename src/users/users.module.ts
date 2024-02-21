import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./application/users.service";
import { User } from "./domain/user.entity";
import { UsersController } from "./presentation/users.controller";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    {
      provide: "IUsersService",
      useClass: UsersService,
    },
  ],
  exports: [
    {
      provide: "IUsersService",
      useClass: UsersService,
    },
  ],
})
export class UsersModule {}
