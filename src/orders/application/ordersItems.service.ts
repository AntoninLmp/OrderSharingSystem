import { Injectable } from "@nestjs/common";
import { isEmpty } from "@nestjs/common/utils/shared.utils";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "../../products/domain/product.entity";
import { ProductNotFoundException } from "../../products/exception/productNotFound.exception";
import { User } from "../../users/domain/user.entity";
import { UserNotFoundException } from "../../users/exception/UserNotFoundException.exception";
import { Order } from "../domain/order.entity";
import { OrderItem } from "../domain/orderItem.entity";
import { OrderNotFoundException } from "../exception/OrdersNotFoundException.exception";
import { IOrderItemService } from "./ordersItems.service.interface";

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
  ) {}
  async createItem(userId: number, orderItem: OrderItem): Promise<OrderItem> {
    // ---- Order && Product && User must exist ----
    const orderFound = await this.orderRepository.findBy({ id: orderItem.order.id });
    if (isEmpty(orderFound)) {
      throw new OrderNotFoundException(orderItem.order.id);
    }
    const productFound = await this.productRepository.findBy({ id: orderItem.product.id });
    if (isEmpty(productFound)) {
      throw new ProductNotFoundException(orderItem.product.id);
    }
    const userFound = await this.userRepository.find({ where: { id: userId }, relations: ["order"] });
    if (isEmpty(userFound)) {
      throw new UserNotFoundException(userId);
    }
    orderItem.user = userFound![0];
    console.log("orderFound", orderFound);

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
