import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductService } from "./application/product.service";
import { Product } from "./domain/product.entity";
import { ProductController } from "./presentation/product.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [
    {
      provide: "IProductService",
      useClass: ProductService,
    },
  ],
})
export class ProductModule {}
