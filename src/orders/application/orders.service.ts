import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BowlingAlley } from "../../bowlings/domain/bowlingAlley.entity";
import { BowlingAlleyIsMissingException } from "../../bowlings/exception/BowlingAlleyIsMissingException.exception";
import { BowlingAlleyNotFoundException } from "../../bowlings/exception/BowlingAlleyNotFoundException.exception";
import { Order } from "../domain/order.entity";
import { OrderAlreadyAssociateWithBowlingAlleyException } from "../exception/OrderAlreadyAssociateWithBowlingAlleyException.exception";
import { OrderNotFoundException } from "../exception/OrdersNotFoundException.exception";
import { IOrderService } from "./orders.service.interface";

@Injectable()
export class OrdersService implements IOrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(BowlingAlley)
    private readonly bowlingAlleyRepository: Repository<BowlingAlley>,
  ) {}

  async create(order: Order): Promise<Order> {
    if (!order.bowlingAlley) {
      throw new BowlingAlleyIsMissingException();
    }
    const bowlingAlleyFound = await this.bowlingAlleyRepository.findOneBy({ id: order.bowlingAlley.id });
    if (!bowlingAlleyFound) {
      throw new BowlingAlleyNotFoundException();
    }
    const orderFound = await this.orderRepository.findOneBy({
      bowlingAlley: bowlingAlleyFound,
    });
    if (orderFound) {
      throw new OrderAlreadyAssociateWithBowlingAlleyException();
    }

    try {
      return await this.orderRepository.save(order);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll(): Promise<Order[]> {
    try {
      return await this.orderRepository.find({
        relations: ["contributors", "items", "bowlingAlley"],
      });
    } catch (error) {
      throw new OrderNotFoundException(error.message);
    }
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
