import { Order } from "../../orders/domain/order.entity";
import { User } from "../../users/domain/user.entity";

export interface IPaymentService {
  paymentSpecificAmount(orderId: number, userId: number, amount: number): Promise<Order>;
  paymentTotalAmount(orderId: number, userId: number): Promise<Order>;
  paymentUserOrder(orderId: number, userId: number): Promise<Order>;
  sendEmails(order: Order, user: User, amount: number): Promise<void>;
  createInvoice(user: User, amountPaid: number): Promise<Buffer>;
}
