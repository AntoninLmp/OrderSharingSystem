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
import { IOrderItemService } from "../application/orderItem.service.interface";
import { Order } from "../domain/order.entity";
import { OrderItem } from "../domain/orderItem.entity";
import { OrderAlreadyExistsException } from "../exception/OrderAlreadyExistsException.exception";

@Controller("orders")
export class OrderController {
  constructor(
    @Inject("IOrderService") private readonly orderService: IOrderService,
    @Inject("IOrderItemService") private readonly orderItemService: IOrderItemService,
  ) {}

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
  @Post("item")
  @HttpCode(200)
  async createItem(@Body() orderItem: OrderItem): Promise<OrderItem> {
    try {
      return await this.orderItemService.createItem(orderItem);
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
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get("items")
  @HttpCode(200)
  async getAllOrderItem(): Promise<OrderItem[]> {
    try {
      return await this.orderItemService.findAllItem();
    } catch (error) {
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get("item/:id")
  @HttpCode(200)
  async getOrderById(@Param("id") id: number): Promise<Order> {
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
  @Delete("item/:id")
  @HttpCode(204)
  async deleteItem(@Param("id") id: number): Promise<void> {
    try {
      await this.orderItemService.deleteItem(id);
    } catch (error) {
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
