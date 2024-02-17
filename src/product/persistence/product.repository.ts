import { Injectable } from "@nestjs/common";
import { Product } from "../domain/product.entity";
import { IProductRepository } from "./product.repository.interface";

@Injectable()
export class ProductRepository implements IProductRepository {
  private readonly products: { [id: number]: Product };

  constructor() {
    this.products = {};
  }

  add(product: Product): Product {
    this.products[product.id] = product;
    return this.products[product.id];
  }

  findAll(): Product[] {
    return Object.values(this.products);
  }

  findById(id: number): Product {
    return this.products[id];
  }

  update(id: number, product: Product): Product {
    this.products[id] = product;
    return this.products[id];
  }

  delete(id: number): void {
    delete this.products[id];
  }
}
