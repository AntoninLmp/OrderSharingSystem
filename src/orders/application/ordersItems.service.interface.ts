import { OrderItem } from "../domain/orderItem.entity";

export interface IOrderItemService {
  createItem(userId: number, orderItem: OrderItem): Promise<OrderItem>;
  createSeveralItem(id: number, orderItems: OrderItem[]): Promise<OrderItem[]>;
  findAllItem(): Promise<OrderItem[]>;
  deleteItem(id: number): Promise<void>;
}
