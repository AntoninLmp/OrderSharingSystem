import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailsModule } from "../emails/emails.module";
import { Order } from "../orders/domain/order.entity";
import { OrderItem } from "../orders/domain/orderItem.entity";
import { Product } from "../products/domain/product.entity";
import { User } from "../users/domain/user.entity";
import { PaymentsService } from "./application/payments.service";
import { PaymentsController } from "./presentation/payments.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product, User]), EmailsModule],
  controllers: [PaymentsController],
  providers: [
    {
      provide: "IPaymentService",
      useClass: PaymentsService,
    },
  ],
})
export class PaymentsModule {}
