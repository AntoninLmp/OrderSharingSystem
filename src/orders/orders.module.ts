import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BowlingAlley } from "../bowlings/domain/bowlingAlley.entity";
import { Product } from "../products/domain/product.entity";
import { User } from "../users/domain/user.entity";
import { OrdersService } from "./application/orders.service";
import { OrdersItemsService } from "./application/ordersItems.service";
import { Order } from "./domain/order.entity";
import { OrderItem } from "./domain/orderItem.entity";
import { OrdersController } from "./presentation/orders.controller";
import { OrdersItemsController } from "./presentation/ordersItems.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product, User, BowlingAlley])],
  controllers: [OrdersController, OrdersItemsController],
  providers: [
    {
      provide: "IOrderService",
      useClass: OrdersService,
    },
    {
      provide: "IOrderItemService",
      useClass: OrdersItemsService,
    },
  ],
})
export class OrdersModule {}
