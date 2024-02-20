import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderService } from "./application/order.service";
import { Order } from "./domain/order.entity";
import { OrderItem } from "./domain/orderItem.entity";
import { OrderController } from "./presentation/order.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrderController],
  providers: [
    {
      provide: "IOrderService",
      useClass: OrderService,
    },
  ],
})
export class OrderModule {}
