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
import { IOrderService } from "../application/order.service.interface";
import { Order } from "../domain/order.entity";
import { OrderAlreadyExistsException } from "../exception/OrderAlreadyExistsException.exception";

@Controller("orders")
export class OrderController {
  constructor(@Inject("IOrderService") private readonly orderService: IOrderService) {}

  @Post()
  @HttpCode(200)
  async create(@Body() order: Order): Promise<Order> {
    try {
      return await this.orderService.create(order);
    } catch (error) {
      if (error instanceof OrderAlreadyExistsException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get()
  @HttpCode(200)
  async getAll(): Promise<Order[]> {
    try {
      return await this.orderService.findAll();
    } catch (error) {
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get(":id")
  @HttpCode(200)
  async getById(@Param("id") id: number): Promise<Order> {
    try {
      return await this.orderService.findOrderById(id);
    } catch (error) {
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Put(":id")
  @HttpCode(201)
  async update(@Param("id") id: string, @Body() order: Order): Promise<Order> {
    try {
      return await this.orderService.update(Number(id), order);
    } catch (error) {
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id") id: number): Promise<void> {
    try {
      await this.orderService.delete(id);
    } catch (error) {
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
