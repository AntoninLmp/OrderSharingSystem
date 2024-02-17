import { Product } from "../domain/product.entity";

export interface IProductRepository {
  add(product: Product): Product;
  findAll(): Product[];
  findById(id: number): Product;
  update(id: number, product: Product): Product;
  delete(id: number): void;
}
