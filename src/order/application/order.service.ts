import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "../domain/order.entity";
import { OrderAlreadyExistsException } from "../exception/OrderAlreadyExistsException.exception";
import { OrderNotFoundException } from "../exception/OrderNotFoundException.exception";
import { IOrderService } from "./order.service.interface";

export class OrderService implements IOrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(order: Order): Promise<Order> {
    const orderFound = await this.orderRepository.findOneBy({
      totalAmount: order.totalAmount,
      status: order.status,
      items: order.items,
    });
    if (orderFound) {
      throw new OrderAlreadyExistsException(orderFound.id);
    }
    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }
  async findOrderById(id: number): Promise<Order> {
    const orderFound = await this.orderRepository.findOneBy({ id });
    if (!orderFound) {
      throw new OrderNotFoundException(id);
    }
    return orderFound;
  }

  async update(id: number, order: Order): Promise<Order> {
    const orderFound = await this.orderRepository.findOneBy({ id });
    if (!orderFound) {
      throw new OrderNotFoundException(id);
    }
    return await this.orderRepository.save({ ...orderFound, ...order });
  }

  async delete(id: number): Promise<void> {
    const orderFound = await this.orderRepository.findOneBy({ id });
    if (!orderFound) {
      throw new OrderNotFoundException(id);
    }
    await this.orderRepository.delete(id);
  }
}
