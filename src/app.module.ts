import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BowlingsModule } from "./bowlings/bowlings.module";
import { BowlingAlley } from "./bowlings/domain/bowlingAlley.entity";
import { BowlingPark } from "./bowlings/domain/bowlingPark.entity";
import { AuthModule } from "./auth/auth.module";
import { Order } from "./orders/domain/order.entity";
import { OrderItem } from "./orders/domain/orderItem.entity";
import { OrdersModule } from "./orders/orders.module";
import { PaymentsModule } from "./payments/payments.module";
import { Product } from "./products/domain/product.entity";
import { ProductsModule } from "./products/products.module";
import { User } from "./users/domain/user.entity";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST"),
        port: +configService.get("DB_PORT"),
        username: configService.get("DB_USER"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        entities: [Product, User, Order, OrderItem, BowlingPark, BowlingAlley],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    UsersModule,
    OrdersModule,
    PaymentsModule,
    BowlingsModule,
    AuthModule,
  ],
})
export class AppModule {}
