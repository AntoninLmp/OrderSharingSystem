import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "../orders/domain/order.entity";
import { Product } from "../products/domain/product.entity";
import { BownlingsService } from "./application/bownlings.service";
import { BownlingsAlleyService } from "./application/bownlingsAlley.service";
import { BowlingAlley } from "./domain/bowlingAlley.entity";
import { BowlingPark } from "./domain/bowlingPark.entity";
import { BowlingsController } from "./presentation/bowlings.controller";

@Module({
  imports: [TypeOrmModule.forFeature([BowlingPark, BowlingAlley, Order, Product])],
  controllers: [BowlingsController],
  providers: [
    {
      provide: "IBowlingsService",
      useClass: BownlingsService,
    },
    {
      provide: "IBowlingsAlleyService",
      useClass: BownlingsAlleyService,
    },
  ],
})
export class BowlingsModule {}
