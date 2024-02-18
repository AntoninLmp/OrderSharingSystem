import { Inject, Injectable } from "@nestjs/common";
import { Product } from "../domain/product.entity";
import { ProductAlreadyExistsException } from "../exception/productAlreadyExists.exception";
import { ProductIdNotMatchingException } from "../exception/productIdNotMatching.exception";
import { ProductNotFoundException } from "../exception/productNotFound.exception";
import { IProductRepository } from "../persistence/product.repository.interface";
import { IProductService } from "./product.service.interface";

@Injectable()
export class ProductService implements IProductService {
  constructor(@Inject("IProductRepository") private readonly productRepository: IProductRepository) {}

  create(product: Product): Product {
    if (this.productRepository.findById(product.id)) {
      throw new ProductAlreadyExistsException(product.id);
    }
    return this.productRepository.add(product);
  }

  findAll(): Product[] {
    return this.productRepository.findAll();
  }
  update(id: number, product: Product): Product {
    if (id !== product.id) {
      throw new ProductIdNotMatchingException(id, product.id);
    }

    if (!this.productRepository.findById(id)) {
      throw new ProductNotFoundException(id);
    }

    return this.productRepository.update(id, product);
  }

  delete(id: number): void {
    if (!this.productRepository.findById(id)) {
      throw new ProductNotFoundException(id);
    }

    return this.productRepository.delete(id);
  }
}
