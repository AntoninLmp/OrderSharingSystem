import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BowlingPark } from "../bowlings/domain/bowlingPark.entity";
import { ProductsService } from "./application/products.service";
import { Product } from "./domain/product.entity";
import { ProductsController } from "./presentation/products.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Product, BowlingPark])],
  controllers: [ProductsController],
  providers: [
    {
      provide: "IProductsService",
      useClass: ProductsService,
    },
  ],
})
export class ProductsModule {}
