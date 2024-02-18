import { Module } from "@nestjs/common";
import { ProductService } from "./application/product.service";
import { ProductRepository } from "./persistence/product.repository";
import { ProductController } from "./presentation/product.controller";

@Module({
  controllers: [ProductController],
  providers: [
    {
      provide: "IProductRepository",
      useClass: ProductRepository,
    },
    {
      provide: "IProductService",
      useClass: ProductService,
    },
  ],
})
export class ProductModule {}
