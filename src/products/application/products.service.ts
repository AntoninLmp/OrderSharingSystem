import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BowlingPark } from "../../bowlings/domain/bowlingPark.entity";
import { BowlingParkIsMissingException } from "../../bowlings/exception/BowlingParkIsMissingException.exception";
import { BowlingParkNotFoundException } from "../../bowlings/exception/BowlingParkNotFoundException.exception";
import { Product } from "../domain/product.entity";
import { ProductAlreadyExistsException } from "../exception/productAlreadyExists.exception";
import { ProductIsNotValidException } from "../exception/ProductIsNotValidException.exception";
import { ProductNotFoundException } from "../exception/productNotFound.exception";
import { IProductsService } from "./products.service.interface";

@Injectable()
export class ProductsService implements IProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(BowlingPark)
    private readonly bowlingParkRepository: Repository<BowlingPark>,
  ) {}

  async create(product: Product): Promise<Product> {
    if (!product.bowlingPark) {
      throw new BowlingParkIsMissingException();
    }
    if (!product.name || !product.description || !product.price) {
      throw new ProductIsNotValidException();
    }

    const bowlingParkFound = await this.bowlingParkRepository.findOneBy({ id: product.bowlingPark.id });
    if (!bowlingParkFound) {
      throw new BowlingParkNotFoundException(product.bowlingPark.id);
    }
    const productFound = await this.productRepository.findOneBy({
      name: product.name,
      description: product.description,
      price: product.price,
      bowlingPark: bowlingParkFound,
    });
    if (productFound) {
      throw new ProductAlreadyExistsException();
    }

    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({ relations: ["bowlingPark"] });
  }

  async update(id: number, product: Product): Promise<Product> {
    const productFound = await this.productRepository.findOneBy({ id });

    if (!productFound) {
      throw new ProductNotFoundException(id);
    }

    return await this.productRepository.save({ ...productFound, ...product });
  }

  async delete(id: number): Promise<void> {
    const productFound = await this.productRepository.find({ where: { id }, relations: ["bowlingPark"] });

    if (!productFound) {
      throw new ProductNotFoundException(id);
    }
    console.log(productFound);
    try {
      await this.productRepository.delete(id);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
