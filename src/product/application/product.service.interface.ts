import { Product } from "../domain/product.entity";

export interface IProductService {
  create(product: Product): Promise<Product>;
  findAll(): Promise<Product[]>;
  update(id: number, product: Product): Promise<Product>;
  delete(id: number): Promise<void>;
}
