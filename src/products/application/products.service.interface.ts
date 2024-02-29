import { Product } from "../domain/product.entity";

export interface IProductsService {
  create(product: Product): Promise<Product>;
  findAll(): Promise<Product[]>;
  findByBowlingPark(bowlingParkId: number): Promise<Product[]>;
  update(id: number, product: Product): Promise<Product>;
  delete(id: number): Promise<void>;
}
