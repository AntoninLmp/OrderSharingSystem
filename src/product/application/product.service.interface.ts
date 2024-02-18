import { Product } from "../domain/product.entity";

export interface IProductService {
  create(product: Product): Product;
  findAll(): Product[];
  update(id: number, product: Product): Product;
  delete(id: number): void;
}
