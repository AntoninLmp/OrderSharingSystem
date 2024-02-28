import { exit } from "@nestjs/cli/actions";
import { Injectable } from "@nestjs/common";
import { isEmpty } from "@nestjs/common/utils/shared.utils";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BowlingAlley } from "../../bowlings/domain/bowlingAlley.entity";
import { Product } from "../../products/domain/product.entity";
import { ProductNotFoundException } from "../../products/exception/productNotFound.exception";
import { User } from "../../users/domain/user.entity";
import { UserNotFoundException } from "../../users/exception/UserNotFoundException.exception";
import { Order } from "../domain/order.entity";
import { OrderItem } from "../domain/orderItem.entity";
import { OrderNotFoundException } from "../exception/OrdersNotFoundException.exception";
import { IOrderItemService } from "./ordersItems.service.interface";
import {
  ProductIsNotPresentInThisBowlingParkException
} from "../../products/exception/ProductIsNotPresentInThisBowlingParkException.exception";

@Injectable()
export class OrdersItemsService implements IOrderItemService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BowlingAlley)
    private readonly bowlingAlleyRepository: Repository<BowlingAlley>,
  ) {}
  async createItem(userId: number, orderItem: OrderItem): Promise<OrderItem> {
    // ---- Order && Product && User must exist ----
    const orderFound = await this.orderRepository.find({
      where: { id: orderItem.order.id },
      relations: ["bowlingAlley"],
    });
    if (isEmpty(orderFound)) {
      throw new OrderNotFoundException(orderItem.order.id);
    }
    const productFound = await this.productRepository.find({
      where: { id: orderItem.product.id },
      relations: ["bowlingPark"],
    });
    if (isEmpty(productFound)) {
      throw new ProductNotFoundException(orderItem.product.id);
    }
    const userFound = await this.userRepository.find({ where: { id: userId }, relations: ["order"] });
    if (isEmpty(userFound)) {
      throw new UserNotFoundException(userId);
    }

    // ---- Check if the product is in the same bowling park as the order ----
    const bowlingParkFound = await this.bowlingAlleyRepository.find({
      where: { id: orderFound![0].bowlingAlley.id },
      relations: ["bowlingPark"],
    });
    if (productFound![0].bowlingPark.id !== bowlingParkFound![0].bowlingPark.id) {
      throw new ProductIsNotPresentInThisBowlingParkException();
    }

    orderItem.user = userFound![0];

    // ---- Update the total amount of the order ----
    orderFound![0].totalAmount =
      Number(orderFound![0].totalAmount) + Number(productFound![0].price) * Number(orderItem.quantity);
    await this.orderRepository.save(orderFound![0]);

    // ---- Associate order with user ----
    userFound![0].order = orderFound![0];
    await this.userRepository.save(userFound!);
    return await this.orderItemRepository.save(orderItem);
  }

  async createSeveralItem(id: number, orderItems: OrderItem[]): Promise<OrderItem[]> {
    let orderItem: OrderItem = orderItems[0];
    try {
      for (orderItem of orderItems) {
        await this.createItem(id, orderItem);
      }
    } catch (error) {
      if (error instanceof OrderNotFoundException) {
        throw new OrderNotFoundException(orderItem.order.id);
      }
      if (error instanceof ProductNotFoundException) {
        throw new ProductNotFoundException(orderItem.product.id);
      }
      if (error instanceof UserNotFoundException) {
        throw new UserNotFoundException(id);
      }
      throw new Error(error.message);
    }
    return orderItems;
  }

  async findAllItem(): Promise<OrderItem[]> {
    return await this.orderItemRepository.find({ relations: ["order", "product", "user"] });
  }

  async deleteItem(id: number): Promise<void> {
    const orderItemFound = await this.orderItemRepository.findOneBy({ id });
    if (orderItemFound === undefined) {
      throw new OrderNotFoundException(id);
    }
    await this.orderItemRepository.delete(id);
  }
}
