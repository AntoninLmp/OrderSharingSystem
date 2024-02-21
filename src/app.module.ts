import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./order/domain/order.entity";
import { OrderItem } from "./order/domain/orderItem.entity";
import { OrdersModule } from "./order/orders.module";
import { Product } from "./products/domain/product.entity";
import { ProductsModule } from "./products/products.module";
import { User } from "./users/domain/user.entity";
import { UsersModule } from "./users/users.module";

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
        entities: [Product, User, Order, OrderItem],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    UsersModule,
    OrdersModule,
  ],
})
export class AppModule {}
