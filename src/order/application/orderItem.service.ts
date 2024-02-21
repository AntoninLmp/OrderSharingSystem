import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "../../product/domain/product.entity";
import { ProductNotFoundException } from "../../product/exception/productNotFound.exception";
import { User } from "../../userManagement/domain/user.entity";
import { Order } from "../domain/order.entity";
import { OrderItem } from "../domain/orderItem.entity";
import { OrderNotFoundException } from "../exception/OrderNotFoundException.exception";
import { IOrderItemService } from "./orderItem.service.interface";

@Injectable()
export class OrderItemService implements IOrderItemService {
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
    const orderFound = await this.orderRepository.findOneBy({ id: orderItem.order_id });
    if (!orderFound && orderFound !== null) {
      throw new OrderNotFoundException(orderItem.order.id);
    }
    const productFound = await this.productRepository.findOneBy({ id: orderItem.product_id });
    if (!productFound && productFound !== null) {
      throw new ProductNotFoundException(orderItem.product.id);
    }
    const userFound = await this.userRepository.findOneBy({ id: userId });
    if (!userFound && userFound !== null) {
      throw new ProductNotFoundException(userId);
    }
    // ---- Update the total amount of the order ----
    orderFound!.totalAmount =
      Number(orderFound!.totalAmount) + Number(productFound!.price) * Number(orderItem.quantity);
    await this.orderRepository.save(orderFound!);
    // ---- Update the user order_id ----
    userFound!.order_id = orderFound!.id;
    await this.userRepository.save(userFound!);

    return await this.orderItemRepository.save(orderItem);
  }

  async findAllItem(): Promise<OrderItem[]> {
    return await this.orderItemRepository.find();
  }

  async deleteItem(id: number): Promise<void> {
    const orderItemFound = await this.orderItemRepository.findOneBy({ id });
    if (orderItemFound === undefined) {
      throw new OrderNotFoundException(id);
    }
    await this.orderItemRepository.delete(id);
  }
}
