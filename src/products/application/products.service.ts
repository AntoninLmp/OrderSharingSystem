import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "../domain/product.entity";
import { ProductAlreadyExistsException } from "../exception/productAlreadyExists.exception";
import { ProductNotFoundException } from "../exception/productNotFound.exception";
import { IProductsService } from "./products.service.interface";

@Injectable()
export class ProductsService implements IProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(product: Product): Promise<Product> {
    const productFound = await this.productRepository.findOneBy({
      name: product.name,
      description: product.description,
      price: product.price,
    });

    if (productFound) {
      throw new ProductAlreadyExistsException(productFound.id);
    }

    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async update(id: number, product: Product): Promise<Product> {
    const productFound = await this.productRepository.findOneBy({ id });

    if (!productFound) {
      throw new ProductNotFoundException(id);
    }

    return await this.productRepository.save({ ...productFound, ...product });
  }

  async delete(id: number): Promise<void> {
    const productFound = await this.productRepository.findOneBy({ id });

    if (!productFound) {
      throw new ProductNotFoundException(id);
    }

    await this.productRepository.delete(id);
  }
}
