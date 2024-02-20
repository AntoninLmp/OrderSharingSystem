import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsService } from "./application/products.service";
import { Product } from "./domain/product.entity";
import { ProductsController } from "./presentation/products.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [
    {
      provide: "IProductsService",
      useClass: ProductsService,
    },
  ],
})
export class ProductsModule {}
