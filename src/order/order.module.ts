import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "../product/domain/product.entity";
import { User } from "../userManagement/domain/user.entity";
import { OrderService } from "./application/order.service";
import { OrderItemService } from "./application/orderItem.service";
import { Order } from "./domain/order.entity";
import { OrderItem } from "./domain/orderItem.entity";
import { OrderController } from "./presentation/order.controller";
import { OrderItemController } from "./presentation/orderItem.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product, User])],
  controllers: [OrderController, OrderItemController],
  providers: [
    {
      provide: "IOrderService",
      useClass: OrderService,
    },
    {
      provide: "IOrderItemService",
      useClass: OrderItemService,
    },
  ],
})
export class OrderModule {}
