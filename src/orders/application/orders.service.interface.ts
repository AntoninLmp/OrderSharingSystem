import { Order } from "../domain/order.entity";

export interface IOrderService {
  create(order: Order): Promise<Order>;
  findOrderById(id: number): Promise<Order>;
  findAll(): Promise<Order[]>;
  update(id: number, order: Order): Promise<Order>;
  delete(id: number): Promise<void>;
}
