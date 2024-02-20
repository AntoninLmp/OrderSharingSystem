import { OrderItem } from "../domain/orderItem.entity";

export interface IOrderItemService {
  createItem(orderItem: OrderItem): Promise<OrderItem>;
  findAllItem(): Promise<OrderItem[]>;
  deleteItem(id: number): Promise<void>;
}
