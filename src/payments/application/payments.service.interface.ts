import { Order } from "../../orders/domain/order.entity";

export interface IPaymentService {
  paymentSpecificAmount(orderId: number, userId: number, amount: number): Promise<Order>;
  paymentTotalAmount(orderId: number, userId: number): Promise<Order>;
}
