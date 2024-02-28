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
import { UserNotFoundException } from "../../users/exception/UserNotFoundException.exception";
import { IOrderItemService } from "../application/ordersItems.service.interface";
import { OrderItem } from "../domain/orderItem.entity";
import { CreateOrUpdateOrdersItemsDto } from "../dto/createOrUpdateOrdersItems.dto";
import { OrderNotFoundException } from "../exception/OrdersNotFoundException.exception";

@Controller("ordersItem")
export class OrdersItemsController {
  constructor(@Inject("IOrderItemService") private readonly orderItemService: IOrderItemService) {}

  @Post(":userId")
  @HttpCode(200)
  async createSingleOrderItem(
    @Param("userId") userId: number,
    @Body() createOrUpdateOrdersItemsDto: CreateOrUpdateOrdersItemsDto,
  ): Promise<OrderItem> {
    try {
      return await this.orderItemService.createItem(userId, createOrUpdateOrdersItemsDto as OrderItem);
    } catch (error) {
      throw this.handleErrorCreateOrderItem(error);
    }
  }
  @Post("multiple/:userId")
  @HttpCode(200)
  async createMultipleOrdersItem(
    @Param("userId") userId: number,
    @Body() createOrUpdateOrdersItemsDto: CreateOrUpdateOrdersItemsDto[],
  ): Promise<OrderItem[]> {
    try {
      return await this.orderItemService.createSeveralItem(userId, createOrUpdateOrdersItemsDto as OrderItem[]);
    } catch (error) {
      throw this.handleErrorCreateOrderItem(error);
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

  private handleErrorCreateOrderItem(error: any): HttpException {
    if (error instanceof OrderNotFoundException) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
    if (error instanceof ProductNotFoundException) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
    if (error instanceof UserNotFoundException) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
    throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
