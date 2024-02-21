import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order, OrderStatus } from "../../orders/domain/order.entity";
import { OrderNotFoundException } from "../../orders/exception/OrdersNotFoundException.exception";
import { User } from "../../users/domain/user.entity";
import { UserNotFoundException } from "../../users/exception/UserNotFoundException.exception";
import { OrderHasAlreadyBeenPaidException } from "../exception/OrderHasAlreadyBeenPaidException.exception";
import { UserIsNotAssociatedWithOrderException } from "../exception/UserIsNotAssociatedWithOrderException.exception";
import { IPaymentService } from "./payments.service.interface";

@Injectable()
export class PaymentsService implements IPaymentService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async payment(orderId: number, userId: number, amount: number): Promise<Order> {
    // ---- Order && User must exist ----
    const orderFound = await this.orderRepository.findOneBy({ id: orderId });
    if (!orderFound && orderFound !== null) {
      throw new OrderNotFoundException(orderId);
    }
    console.log("orderFound", orderFound);
    const userFound = await this.userRepository.findOneBy({ id: userId });
    if (!userFound && userFound !== null) {
      throw new UserNotFoundException(userId);
    }
    if (userFound!.order_id !== orderId) {
      throw new UserIsNotAssociatedWithOrderException(userId, orderId);
    }
    if (orderFound!.status === OrderStatus.COMPLETED) {
      throw new OrderHasAlreadyBeenPaidException(orderId);
    }

    // ---- Payment logic ----
    if (orderFound!.totalAmount < amount) {
      orderFound!.totalAmount = 0;
      orderFound!.status = OrderStatus.COMPLETED;
    } else {
      orderFound!.totalAmount = Number(orderFound!.totalAmount) - amount;
    }
    await this.orderRepository.save(orderFound!);

    return orderFound!;
  }
}
