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
import { IOrderService } from "../application/orders.service.interface";
import { Order } from "../domain/order.entity";
import { CreateOrUpdateOrdersDto } from "../dto/createOrUpdateOrders.dto";
import { OrderAlreadyExistsException } from "../exception/OrdersAlreadyExistsException.exception";
import { OrderNotFoundException } from "../exception/OrdersNotFoundException.exception";

@Controller("orders")
export class OrdersController {
  constructor(@Inject("IOrderService") private readonly orderService: IOrderService) {}

  @Post()
  @HttpCode(200)
  async create(@Body() createOrUpdateOrdersDto: CreateOrUpdateOrdersDto): Promise<Order> {
    try {
      return await this.orderService.create(createOrUpdateOrdersDto as Order);
    } catch (error) {
      if (error instanceof OrderAlreadyExistsException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @HttpCode(200)
  async getAllOrder(): Promise<Order[]> {
    try {
      return await this.orderService.findAll();
    } catch (error) {
      if (error instanceof OrderNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(":id")
  @HttpCode(200)
  async getOrderById(@Param("id") id: number): Promise<Order> {
    try {
      return await this.orderService.findOrderById(id);
    } catch (error) {
      if (error instanceof OrderNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Put(":id")
  @HttpCode(201)
  async update(@Param("id") id: string, @Body() createOrUpdateOrdersDto: CreateOrUpdateOrdersDto): Promise<Order> {
    try {
      return await this.orderService.update(Number(id), createOrUpdateOrdersDto as Order);
    } catch (error) {
      if (error instanceof OrderNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id") id: number): Promise<void> {
    try {
      await this.orderService.delete(id);
    } catch (error) {
      if (error instanceof OrderNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
