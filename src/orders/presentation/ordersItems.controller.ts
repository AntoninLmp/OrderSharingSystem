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
} from "@nestjs/common";
import { ProductNotFoundException } from "../../products/exception/productNotFound.exception";
import { IOrderService } from "../application/orders.service.interface";
import { IOrderItemService } from "../application/ordersItems.service.interface";
import { OrderItem } from "../domain/orderItem.entity";
import { OrderNotFoundException } from "../exception/OrdersNotFoundException.exception";

@Controller("ordersItem")
export class OrdersItemsController {
  constructor(
    @Inject("IOrderService") private readonly orderService: IOrderService,
    @Inject("IOrderItemService") private readonly orderItemService: IOrderItemService,
  ) {}

  @Post(":userId")
  @HttpCode(200)
  async createItem(@Param("userId") userId: number, @Body() orderItem: OrderItem): Promise<OrderItem> {
    try {
      return await this.orderItemService.createItem(userId, orderItem);
    } catch (error) {
      if (error instanceof OrderNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error instanceof ProductNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @HttpCode(200)
  async getAllOrderItem(): Promise<OrderItem[]> {
    try {
      return await this.orderItemService.findAllItem();
    } catch (error) {
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Delete(":id")
  @HttpCode(204)
  async deleteItem(@Param("id") id: number): Promise<void> {
    try {
      await this.orderItemService.deleteItem(id);
    } catch (error) {
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
