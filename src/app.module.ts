import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product/domain/product.entity";
import { ProductModule } from "./product/product.module";
import { User } from "./userManagement/domain/user.entity";
import { UserModule } from "./userManagement/userManagement.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST"),
        port: +configService.get("DB_PORT"),
        username: configService.get("DB_USER"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        entities: [Product, User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ProductModule,
    UserModule,
  ],
})
export class AppModule {}
