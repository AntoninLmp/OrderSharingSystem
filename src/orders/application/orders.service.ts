import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "../domain/order.entity";
import { OrderNotFoundException } from "../exception/OrdersNotFoundException.exception";
import { IOrderService } from "./orders.service.interface";

@Injectable()
export class OrdersService implements IOrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(order: Order): Promise<Order> {
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