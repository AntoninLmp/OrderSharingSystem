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
  UseGuards,
} from "@nestjs/common";
import { BowlingParkIsMissingException } from "../../bowlings/exception/BowlingParkIsMissingException.exception";
import { BowlingParkNotFoundException } from "../../bowlings/exception/BowlingParkNotFoundException.exception";
import { AuthGuard } from "../../auth/application/auth.guard";
import { Roles } from "../../auth/application/roles.decorator";
import { RolesGuard } from "../../auth/application/roles.guard";
import { UserRole } from "../../users/domain/user.entity";
import { IProductsService } from "../application/products.service.interface";
import { Product } from "../domain/product.entity";
import { CreateOrUpdateProductDto } from "../dto/createOrUpdateProduct.dto";
import { ProductAlreadyExistsException } from "../exception/productAlreadyExists.exception";
import { ProductIsNotValidException } from "../exception/ProductIsNotValidException.exception";
import { ProductNotFoundException } from "../exception/productNotFound.exception";

@Controller("products")
export class ProductsController {
  constructor(@Inject("IProductsService") private readonly productService: IProductsService) {}

  @Post()
  @HttpCode(200)
  @Roles(UserRole.AGENT)
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Body() createOrUpdateProductDto: CreateOrUpdateProductDto): Promise<Product> {
    try {
      const productCreated = await this.productService.create(createOrUpdateProductDto as Product);
      return new Product(productCreated);
    } catch (error) {
      if (
        error instanceof ProductAlreadyExistsException ||
        error instanceof BowlingParkIsMissingException ||
        error instanceof ProductIsNotValidException
      ) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof BowlingParkNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAll(): Promise<Product[]> {
    try {
      return await this.productService.findAll();
    } catch (error) {
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get("bowlingPark/:bowlingParkId")
  async getProductsByBowlingPark(@Param("bowlingParkId") bowlingParkId: number): Promise<Product[]> {
    try {
      return await this.productService.findByBowlingPark(Number(bowlingParkId));
    } catch (error) {
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(":id")
  @Roles(UserRole.AGENT)
  @UseGuards(AuthGuard, RolesGuard)
  async update(@Param("id") id: string, @Body() createOrUpdateProductDto: CreateOrUpdateProductDto): Promise<Product> {
    try {
      const productUpdated = await this.productService.update(Number(id), createOrUpdateProductDto as Product);
      return new Product(productUpdated);
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(":id")
  @HttpCode(204)
  @Roles(UserRole.AGENT)
  @UseGuards(AuthGuard, RolesGuard)
  async delete(@Param("id") id: number): Promise<void> {
    try {
      await this.productService.delete(id);
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
