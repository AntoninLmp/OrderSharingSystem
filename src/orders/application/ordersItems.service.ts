import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "../../products/domain/product.entity";
import { ProductNotFoundException } from "../../products/exception/productNotFound.exception";
import { User } from "../../users/domain/user.entity";
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
    // ---- Order && Product must exist ----
    const orderFound = await this.orderRepository.findBy({
      id: orderItem.order.id,
    });
    if (!orderFound && orderFound !== null) {
      throw new OrderNotFoundException(orderItem.order.id);
    }
    const productFound = await this.productRepository.findBy({
      id: orderItem.product.id,
    });
    if (!productFound && productFound !== null) {
      throw new ProductNotFoundException(orderItem.product.id);
    }
    const userFound = await this.userRepository.find({
      where: { id: userId },
      relations: ["order"],
    });
    if (!userFound && userFound !== null) {
      throw new ProductNotFoundException(userId);
    }
    // ---- Update the total amount of the order ----
    orderFound![0].totalAmount =
      Number(orderFound![0].totalAmount) + Number(productFound![0].price) * Number(orderItem.quantity);
    await this.orderRepository.save(orderFound![0]);
    // ---- Associate order with user ----
    userFound![0].order = orderFound![0];
    await this.userRepository.save(userFound!);
    return await this.orderItemRepository.save(orderItem);
  }

  async findAllItem(): Promise<OrderItem[]> {
    return await this.orderItemRepository.find({ relations: ["order", "product"] });
  }

  async deleteItem(id: number): Promise<void> {
    const orderItemFound = await this.orderItemRepository.findOneBy({ id });
    if (orderItemFound === undefined) {
      throw new OrderNotFoundException(id);
    }
    await this.orderItemRepository.delete(id);
  }
}
