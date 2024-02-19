import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { IProductService } from "../application/product.service.interface";
import { Product } from "../domain/product.entity";
import { ProductAlreadyExistsException } from "../exception/productAlreadyExists.exception";
import { ProductIdNotMatchingException } from "../exception/productIdNotMatching.exception";
import { ProductNotFoundException } from "../exception/productNotFound.exception";

@Controller("products")
export class ProductController {
  constructor(@Inject("IProductService") private readonly productService: IProductService) {}

  @Post()
  @HttpCode(200)
  async create(@Body() createOrUpdateProductDto: CreateOrUpdateProductDto): Promise<Product> {
    try {
      return await this.productService.create(createOrUpdateProductDto as Product);
    } catch (error) {
      if (error instanceof ProductAlreadyExistsException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  getAll(): Product[] {
    return this.productService.findAll();
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() createOrUpdateProductDto: CreateOrUpdateProductDto): Promise<Product> {
    try {
      return await this.productService.update(Number(id), createOrUpdateProductDto as Product);
    } catch (error) {
      if (error instanceof ProductIdNotMatchingException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else if (error instanceof ProductNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(":id")
  @HttpCode(204)
  delete(@Param("id") id: number): void {
    try {
      this.productService.delete(id);
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
