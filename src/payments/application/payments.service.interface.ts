import { Order } from "../../orders/domain/order.entity";

export interface IPaymentService {
  payment(orderId: number, userId: number, amount: number): Promise<Order>;
}
